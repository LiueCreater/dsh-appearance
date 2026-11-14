const KEEP_DAYS = 30
const DAY_MS = 86400000

export function beijingDay(now = Date.now()) {
  return new Date(Number(now) + 8 * 3600000).toISOString().slice(0, 10)
}

export function createUsage(store, onChange) {
  let data = store.readUsage()
  if (!data || typeof data !== 'object' || !data.days || typeof data.days !== 'object') {
    data = { days: {} }
  }
  let saveTimer = null

  function prune() {
    const cutoff = beijingDay(Date.now() - KEEP_DAYS * DAY_MS)
    for (const key of Object.keys(data.days)) {
      if (key < cutoff) delete data.days[key]
    }
  }

  function ensure() {
    const key = beijingDay()
    let row = data.days[key]
    if (!row || typeof row !== 'object') {
      row = { total: 0, sessions: {}, updatedAt: 0 }
      data.days[key] = row
    }
    if (!row.sessions || typeof row.sessions !== 'object') row.sessions = {}
    if (!Number.isFinite(Number(row.cost))) row.cost = 0
    if (!row.sessionCost || typeof row.sessionCost !== 'object') row.sessionCost = {}
    return row
  }

  function flush() {
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = null
    }
    prune()
    store.writeUsage(data)
  }

  function schedule() {
    if (saveTimer) return
    saveTimer = setTimeout(flush, 800)
    if (typeof saveTimer.unref === 'function') saveTimer.unref()
  }

  function add(sessionId, tokens, cost) {
    const n = Math.round(Number(tokens))
    const c = Number(cost)
    if ((!Number.isFinite(n) || n <= 0) && !(Number.isFinite(c) && c > 0)) return
    const row = ensure()
    const sid = String(sessionId || 'default')
    if (Number.isFinite(n) && n > 0) {
      row.total = (Number(row.total) || 0) + n
      row.sessions[sid] = (Number(row.sessions[sid]) || 0) + n
    }
    if (Number.isFinite(c) && c > 0) {
      row.cost = Math.round(((Number(row.cost) || 0) + c) * 1e6) / 1e6
      row.sessionCost[sid] = Math.round(((Number(row.sessionCost[sid]) || 0) + c) * 1e6) / 1e6
    }
    row.updatedAt = Date.now()
    schedule()
    try {
      onChange && onChange()
    } catch {
      /* ignore */
    }
  }

  function snapshot(now = Date.now()) {
    ensure()
    prune()
    const row = data.days[beijingDay(now)] || { total: 0, sessions: {} }
    return {
      day: beijingDay(now),
      total: Number(row.total) || 0,
      sessions: { ...row.sessions },
      cost: Number(row.cost) || 0,
      sessionCost: { ...(row.sessionCost || {}) },
    }
  }

  return { add, flush, snapshot }
}
