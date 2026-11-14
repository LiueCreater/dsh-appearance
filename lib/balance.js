const BALANCE_URL = 'https://api.deepseek.com/user/balance'
const TTL_MS = 25000
const MIN_FORCE_MS = 10000
const REQUEST_TIMEOUT_MS = 8000
const CREDENTIAL_TIMEOUT_MS = 4000

function errorMessage(err) {
  const text = err && err.message ? err.message : String(err || 'unknown error')
  return text.slice(0, 200)
}

function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label}超时`)), ms)
    if (typeof timer.unref === 'function') timer.unref()
    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (err) => {
        clearTimeout(timer)
        reject(err)
      },
    )
  })
}

function normalizeCurrency(value) {
  const text = String(value || 'CNY').trim().toUpperCase()
  return text || 'CNY'
}

function walletsFromApi(json) {
  const infos = Array.isArray(json && json.balance_infos) ? json.balance_infos : []
  const wallets = []
  for (const info of infos) {
    const balance = Number(info && info.total_balance)
    if (!Number.isFinite(balance)) continue
    wallets.push({ currency: normalizeCurrency(info.currency), balance })
  }
  if (!wallets.length) return null
  const preferred =
    wallets.find((w) => w.currency === 'CNY' && w.balance > 0) ||
    wallets.find((w) => w.balance > 0) ||
    wallets.find((w) => w.currency === 'CNY') ||
    wallets[0]
  return [{ currency: preferred.currency, balance: preferred.balance.toFixed(2) }]
}

function walletsFromAccount(result) {
  const raw = []
  if (Array.isArray(result.value)) raw.push(...result.value)
  if (Array.isArray(result.bonusWallets)) raw.push(...result.bonusWallets)
  const totals = new Map()
  for (const wallet of raw) {
    const amount = Number(wallet && wallet.balance)
    if (!Number.isFinite(amount)) continue
    const currency = normalizeCurrency(wallet.currency)
    totals.set(currency, (totals.get(currency) || 0) + amount)
  }
  if (!totals.size) return null
  return [...totals.entries()]
    .sort((a, b) => {
      if (a[0] === b[0]) return 0
      if (a[0] === 'CNY') return -1
      if (b[0] === 'CNY') return 1
      return a[0].localeCompare(b[0])
    })
    .map(([currency, balance]) => ({ currency, balance: balance.toFixed(2) }))
}

export function createBalance(ctx) {
  let cache = { value: null, at: 0, error: '余额尚未读取', source: null }
  let inflight = null
  let lastAttempt = 0
  let onChange = null

  function optional(name) {
    try {
      return typeof ctx.get === 'function' ? ctx.get(name) : null
    } catch {
      return null
    }
  }

  async function attempt() {
    const errors = []
    let apiKey = null
    const credentials = optional('credentials')
    if (credentials && typeof credentials.resolve === 'function') {
      try {
        const record = await withTimeout(credentials.resolve('DEEPSEEK_API_KEY'), CREDENTIAL_TIMEOUT_MS, '读取 API Key')
        const value = record && typeof record === 'object' ? record.value : record
        if (typeof value === 'string' && value.trim()) apiKey = value.trim()
      } catch (err) {
        errors.push(`读取 API Key 失败：${errorMessage(err)}`)
      }
    }
    if (!apiKey && !errors.length) errors.push('未配置 DEEPSEEK_API_KEY')

    if (apiKey) {
      try {
        const response = await fetch(BALANCE_URL, {
          headers: { Authorization: `Bearer ${apiKey}` },
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        })
        if (response.ok) {
          const wallets = walletsFromApi(await response.json())
          if (wallets) return { value: { wallets, source: 'api-key' }, error: null }
          errors.push('余额接口未返回可用钱包')
        } else {
          errors.push(`余额接口 HTTP ${response.status}`)
        }
      } catch (err) {
        errors.push(`余额请求失败：${errorMessage(err)}`)
      }
    }

    const account = optional('deepseekAccount')
    if (!account || typeof account.getBalance !== 'function') {
      errors.push('当前 DSH 版本没有账号余额服务')
      return { value: null, error: errors.join('；') }
    }
    try {
      const result = await withTimeout(
        account.getBalance({
          version: String(process.env.DSH_CLIENT_VERSION || process.env.DSH_VERSION || 'unknown'),
          locale: String(process.env.DSH_LOCALE || 'zh_CN'),
          timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60,
        }),
        REQUEST_TIMEOUT_MS,
        '账号余额',
      )
      if (!result) {
        errors.push('未登录 DeepSeek 账号')
        return { value: null, error: errors.join('；') }
      }
      if (result.status !== 'ready') {
        errors.push(`账号余额不可用（${String(result.status || 'unknown')}）`)
        return { value: null, error: errors.join('；') }
      }
      const wallets = walletsFromAccount(result)
      if (!wallets) {
        errors.push('账号没有可用余额')
        return { value: null, error: errors.join('；') }
      }
      return { value: { wallets, source: 'account' }, error: null }
    } catch (err) {
      errors.push(`账号余额调用失败：${errorMessage(err)}`)
      return { value: null, error: errors.join('；') }
    }
  }

  function refresh(force = false) {
    const now = Date.now()
    if (!force && cache.value && cache.at && now - cache.at < TTL_MS) {
      return Promise.resolve(cache)
    }
    if (inflight) return inflight
    if (force && lastAttempt && now - lastAttempt < MIN_FORCE_MS) {
      return Promise.resolve(cache)
    }
    lastAttempt = now
    inflight = attempt()
      .then((result) => {
        const success = Boolean(result.value)
        cache = {
          value: result.value || cache.value,
          source: result.value ? result.value.source : cache.source,
          error: result.error,
          at: success ? Date.now() : 0,
        }
        return cache
      })
      .catch((err) => {
        cache = { value: cache.value, source: cache.source, error: errorMessage(err), at: 0 }
        return cache
      })
      .finally(() => {
        inflight = null
        try {
          onChange && onChange(cache)
        } catch {
          /* ignore */
        }
      })
    return inflight
  }

  return {
    refresh,
    setOnChange(fn) {
      onChange = fn
    },
    snapshot() {
      return {
        balance: cache.value,
        balanceError: cache.error,
        balanceAt: cache.at,
      }
    },
  }
}
