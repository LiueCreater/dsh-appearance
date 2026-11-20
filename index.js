import os from 'node:os'
import path from 'node:path'
import { createStore } from './lib/store.js'
import { createUsage } from './lib/usage.js'
import { createBalance } from './lib/balance.js'
import { createHub, installRoutes } from './lib/http.js'

export const name = 'dsh-lifiwallpaper'

const ACTIVE_TURN_LIMIT = 400

// CNY per million tokens, [off-peak, peak]. Peak = Beijing local 09:00-12:00,
// 14:00-18:00 on weekdays, matching the DeepSeek pricing schedule.
const PRICE_FLASH = { hit: [0.02, 0.04], miss: [1, 2], out: [4, 8] }
const PRICE_PRO = { hit: [0.15, 0.3], miss: [4.5, 9], out: [13.5, 27] }

function isPeakTime(now) {
  const local = new Date(Number(now) + 8 * 3600000)
  const day = local.getUTCDay()
  if (day === 0 || day === 6) return false
  const hour = local.getUTCHours() + local.getUTCMinutes() / 60
  return (hour >= 9 && hour < 12) || (hour >= 14 && hour < 18)
}

function turnCostCny(usage, model, now) {
  const table = /pro/i.test(String(model || '')) ? PRICE_PRO : PRICE_FLASH
  const idx = isPeakTime(now) ? 1 : 0
  const input = Number(usage.inputTokens) || 0
  const cache = Number(usage.cacheReadTokens) || 0
  const output = Number(usage.outputTokens) || 0
  return (cache / 1e6) * table.hit[idx] + (input / 1e6) * table.miss[idx] + (output / 1e6) * table.out[idx]
}

export function apply(ctx) {
  const home = process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
  const store = createStore(path.join(home, 'dsh-appearance'))

  const log = (level, message) => {
    try {
      const logger = ctx.logger
      if (!logger) return
      const text = `[dsh-appearance] ${message}`
      if (level === 'warn' && typeof logger.warn === 'function') logger.warn(text)
      else if (typeof logger.info === 'function') logger.info(text)
    } catch {
      /* ignore */
    }
  }

  const balance = createBalance(ctx)
  const usage = createUsage(store, () => scheduleBroadcast())

  const getState = () => {
    const snapshot = balance.snapshot()
    const images = store.getImages()
    const brief = (image) =>
      image
        ? { version: image.version, mime: image.mime, kind: image.kind, bytes: image.bytes, width: image.width || 0, height: image.height || 0, updatedAt: image.updatedAt }
        : null
    return {
      config: store.getConfig(),
      images: { light: brief(images.light), dark: brief(images.dark) },
      image: brief(images.light),
      revision: store.revision(),
      balance: snapshot.balance,
      balanceError: snapshot.balanceError,
      balanceAt: snapshot.balanceAt,
      usage: usage.snapshot(),
      serverTime: Date.now(),
    }
  }

  const hub = createHub(getState)
  let broadcastTimer = null

  function scheduleBroadcast() {
    if (broadcastTimer) return
    broadcastTimer = setTimeout(() => {
      broadcastTimer = null
      try {
        hub.broadcast()
      } catch {
        /* ignore */
      }
    }, 200)
    if (typeof broadcastTimer.unref === 'function') broadcastTimer.unref()
  }

  balance.setOnChange(() => scheduleBroadcast())

  const activeTurns = new Map()

  function handleSessionEvent(session, event) {
    try {
      const sessionId = session && session.id ? session.id : 'default'
      const type = event && event.type
      const data = event && event.data
      if (!data || typeof data !== 'object') return

      if (type === 'turn/end') {
        const turn = Number(data.turn)
        if (Number.isFinite(turn)) activeTurns.delete(`${sessionId}:${turn}`)
        usage.flush()
        balance.refresh(true).catch(() => {})
        scheduleBroadcast()
        return
      }

      if (type !== 'assistant/message') return
      const turn = Number(data.turn)
      const usageData = data.usage
      if (!usageData || typeof usageData !== 'object' || !Number.isFinite(turn)) return
      const tokens =
        (Number(usageData.inputTokens) || 0) +
        (Number(usageData.cacheReadTokens) || 0) +
        (Number(usageData.outputTokens) || 0)
      if (tokens <= 0) return
      const key = `${sessionId}:${turn}`
      let aggregate = activeTurns.get(key)
      if (!aggregate) {
        aggregate = { messageIds: new Set() }
        activeTurns.set(key, aggregate)
        if (activeTurns.size > ACTIVE_TURN_LIMIT) {
          const oldest = activeTurns.keys().next()
          if (!oldest.done) activeTurns.delete(oldest.value)
        }
      }
      const messageId =
        (data.message && (data.message.id || data.message.messageId)) || data.id || null
      if (messageId) {
        if (aggregate.messageIds.has(messageId)) return
        aggregate.messageIds.add(messageId)
      }
      const model = data.message && data.message.source ? data.message.source.model : ''
      usage.add(sessionId, tokens, turnCostCny(usageData, model, Date.now()))
    } catch (err) {
      log('warn', `usage accounting failed: ${String((err && err.message) || err)}`)
    }
  }

  ctx.effect(
    () => ctx.on('session/event', (session, event) => handleSessionEvent(session, event)),
    'dsh-appearance: token accounting',
  )

  ctx.effect(
    () => () => {
      try {
        usage.flush()
      } catch {
        /* ignore */
      }
    },
    'dsh-appearance: usage flush',
  )

  ctx.effect(
    () =>
      ctx.on('session/disposed', (session) => {
        const sessionId = session && session.id ? session.id : null
        if (!sessionId) return
        for (const key of [...activeTurns.keys()]) {
          if (key.startsWith(`${sessionId}:`)) activeTurns.delete(key)
        }
      }),
    'dsh-appearance: session cleanup',
  )

  ctx.effect(() => {
    const timer = setInterval(() => {
      try {
        if (hub.size() > 0) {
          balance.refresh(true).catch(() => {})
        }
      } catch {
        /* ignore */
      }
    }, 60000)
    if (typeof timer.unref === 'function') timer.unref()
    return () => clearInterval(timer)
  }, 'dsh-appearance: balance heartbeat')

  try {
    ctx.inject(['webServer'], (webCtx) => {
      webCtx.effect(
        () => installRoutes(webCtx, { store, usage, balance, hub, getState, log }),
        'dsh-appearance: web routes',
      )
    })
  } catch (err) {
    log('warn', `webServer unavailable: ${String((err && err.message) || err)}`)
  }

  log('info', 'ready')
}
