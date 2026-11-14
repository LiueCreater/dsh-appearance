import crypto from 'node:crypto'
import { MAX_IMAGE_BYTES, detectImageMime } from './store.js'
import { buildZip, readZip, zipLimits } from './zip.js'

const MAX_BODY_BYTES = 80 * 1024 * 1024
const MAX_IMPORT_BYTES = 200 * 1024 * 1024
const HEARTBEAT_MS = 25000
const PACK_FORMAT = 'dsh-appearance-style-pack'
const PACK_VERSION = 1
export const PACK_MAGIC = 'DSHAPPEARANCE-STYLE-PACK-1'

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex')
}

function packChecksum(config, images) {
  const summary = {
    config,
    images: {
      light: images.light ? sha256(images.light) : null,
      dark: images.dark ? sha256(images.dark) : null,
    },
  }
  return sha256(`${PACK_MAGIC}\n${JSON.stringify(summary)}`)
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const left = Buffer.from(a, 'utf8')
  const right = Buffer.from(b, 'utf8')
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

export function createHub(getState) {
  const clients = new Set()
  return {
    subscribe(res) {
      clients.add(res)
      return () => clients.delete(res)
    },
    size() {
      return clients.size
    },
    broadcast() {
      if (!clients.size) return
      let payload
      try {
        payload = `event: state\ndata: ${JSON.stringify(getState())}\n\n`
      } catch {
        return
      }
      for (const res of clients) {
        try {
          res.write(payload)
        } catch {
          clients.delete(res)
        }
      }
    },
    closeAll() {
      for (const res of clients) {
        try {
          res.end()
        } catch {
          /* ignore */
        }
      }
      clients.clear()
    },
  }
}

function sendJson(res, status, body) {
  const text = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(text),
  })
  res.end(text)
}

function hostAllowed(hostHeader) {
  const host = String(hostHeader || '').toLowerCase()
  if (!host) return false
  const hostname = host.startsWith('[') ? host.slice(0, host.indexOf(']') + 1) : host.split(':')[0]
  const trusted = String(process.env.DSH_APPEARANCE_TRUSTED_HOSTS || '')
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
  if (trusted.includes(host)) return true
  return hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '[::1]'
}

function sameOrigin(req) {
  const host = String(req.headers.host || '')
  if (!hostAllowed(host)) return false
  const origin = req.headers.origin
  const site = String(req.headers['sec-fetch-site'] || '')
  if (site && site !== 'same-origin' && site !== 'same-site' && site !== 'none') return false
  if (origin) {
    try {
      if (new URL(origin).host !== host) return false
    } catch {
      return false
    }
  }
  return true
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let total = 0
    let done = false
    const fail = (status, message) => {
      if (done) return
      done = true
      const err = new Error(message)
      err.status = status
      req.destroy()
      reject(err)
    }
    req.on('data', (chunk) => {
      if (done) return
      total += chunk.length
      if (total > limit) {
        fail(413, '请求体超过上限')
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (done) return
      done = true
      resolve(Buffer.concat(chunks))
    })
    req.on('error', (err) => {
      if (done) return
      done = true
      reject(err)
    })
  })
}

function acceptsJson(req) {
  const text = String(req.headers.accept || '')
  return text.includes('application/json')
}

function modeOf(url) {
  return url.searchParams.get('mode') === 'dark' ? 'dark' : 'light'
}

export function parseRange(header, size) {
  if (typeof header !== 'string' || !header.trim()) return null
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim())
  if (!match) return null
  const startText = match[1]
  const endText = match[2]
  let start
  let end
  if (startText === '') {
    const suffix = Number(endText)
    if (!Number.isFinite(suffix) || suffix <= 0) return null
    start = Math.max(0, size - suffix)
    end = size - 1
  } else {
    start = Number(startText)
    end = endText === '' ? size - 1 : Number(endText)
  }
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null
  if (start < 0 || start >= size) return null
  end = Math.min(end, size - 1)
  if (end < start) return null
  return { start, end }
}

function buildPack(store) {
  const config = store.getConfig()
  const images = {
    light: store.getImage('light') ? store.readImage('light') : null,
    dark: store.getImage('dark') ? store.readImage('dark') : null,
  }
  const manifest = {
    format: PACK_FORMAT,
    formatVersion: PACK_VERSION,
    magic: PACK_MAGIC,
    createdAt: new Date().toISOString(),
    checksum: packChecksum(config, images),
    config,
    images: {},
  }
  const entries = []
  for (const mode of ['light', 'dark']) {
    const data = images[mode]
    const meta = store.getImage(mode)
    if (data && meta) {
      manifest.images[mode] = {
        file: `${mode}.bin`,
        mime: meta.mime,
        kind: meta.kind,
        bytes: data.length,
        sha256: sha256(data),
      }
      entries.push({ name: `${mode}.bin`, data })
    } else {
      manifest.images[mode] = null
    }
  }
  entries.unshift({ name: 'manifest.json', data: Buffer.from(JSON.stringify(manifest, null, 2), 'utf8') })
  return buildZip(entries)
}

function applyPack(store, buf) {
  const entries = readZip(buf, zipLimits())
  const manifestRaw = entries.get('manifest.json')
  if (!manifestRaw) throw new Error('压缩包缺少 manifest.json')
  let manifest
  try {
    manifest = JSON.parse(manifestRaw.toString('utf8'))
  } catch {
    throw new Error('manifest.json 不是合法 JSON')
  }
  if (!manifest || manifest.format !== PACK_FORMAT || manifest.formatVersion !== PACK_VERSION || manifest.magic !== PACK_MAGIC) {
    throw new Error('不是本插件的样式包或版本不受支持')
  }
  const images = {
    light: null,
    dark: null,
  }
  for (const mode of ['light', 'dark']) {
    const meta = manifest.images && manifest.images[mode]
    if (!meta) continue
    if (meta.file !== `${mode}.bin`) throw new Error('样式包文件名不匹配')
    const data = entries.get(`${mode}.bin`)
    if (!data) throw new Error('样式包缺少壁纸文件')
    if (!Number.isFinite(Number(meta.bytes)) || data.length !== Number(meta.bytes)) throw new Error('壁纸大小不一致')
    if (!safeEqual(sha256(data), String(meta.sha256 || ''))) throw new Error('壁纸校验失败')
    images[mode] = data
  }
  const expected = packChecksum(manifest.config, images)
  if (!safeEqual(String(manifest.checksum || ''), expected)) throw new Error('样式包校验信息不匹配，已拒绝导入')
  // Validate every wallpaper before mutating anything, so a bad pack never
  // leaves config and media out of sync.
  for (const mode of ['light', 'dark']) {
    if (!images[mode]) continue
    if (images[mode].length > MAX_IMAGE_BYTES) throw new Error('壁纸超过大小上限')
    const info = detectImageMime(images[mode])
    const declared = manifest.images[mode]
    if (!info) throw new Error('壁纸格式不受支持')
    if (declared.mime && declared.mime !== info.mime) throw new Error('壁纸类型与清单不一致')
    if (declared.kind && declared.kind !== info.kind) throw new Error('壁纸类型与清单不一致')
  }
  const previous = {
    config: store.getConfig(),
    images: {
      light: store.getImage('light') ? store.readImage('light') : null,
      dark: store.getImage('dark') ? store.readImage('dark') : null,
    },
  }
  const restore = () => {
    try {
      store.setConfig(previous.config)
    } catch {
      /* keep the old config if even the rollback fails */
    }
    for (const mode of ['light', 'dark']) {
      try {
        if (previous.images[mode]) store.saveImage(mode, previous.images[mode])
        else store.removeImage(mode)
      } catch {
        /* best effort */
      }
    }
  }
  // Media and config are written in one transaction: if any step throws, put
  // the previous wallpapers and config back so the store never ends up with a
  // pack's config but the old media (or vice versa).
  try {
    for (const mode of ['light', 'dark']) {
      if (images[mode]) {
        const saved = store.saveImage(mode, images[mode])
        const declared = manifest.images[mode]
        if (declared.mime && saved.mime !== declared.mime) throw new Error('壁纸类型与清单不一致')
      } else {
        store.removeImage(mode)
      }
    }
    return store.setConfig(manifest.config)
  } catch (err) {
    restore()
    throw err
  }
}

export function installRoutes(ctx, deps) {
  const { store, usage, balance, hub, getState, log } = deps
  const base = '/dsh-appearance'
  const disposers = []

  function guarded(req, res) {
    if (!sameOrigin(req)) {
      sendJson(res, 403, { error: '拒绝跨源请求' })
      return false
    }
    return true
  }

  async function stateWith(force) {
    if (force) {
      try {
        await balance.refresh(true)
      } catch {
        /* ignore */
      }
    }
    return getState()
  }

  disposers.push(
    ctx.webServer.register({
      kind: 'prefix',
      path: base,
      handler: async (req, res) => {
        try {
          const url = new URL(req.url || '/', 'http://localhost')
          const route = url.pathname.slice(base.length) || '/'
          const method = req.method || 'GET'

          if (route === '/state' && (method === 'GET' || method === 'HEAD')) {
            if (!guarded(req, res)) return
            const force = url.searchParams.get('force') === '1'
            sendJson(res, 200, await stateWith(method === 'GET' && force))
            return
          }

          if (route === '/refresh' && method === 'POST') {
            if (!guarded(req, res)) return
            await readBody(req, 64 * 1024).catch(() => {})
            await balance.refresh(true)
            hub.broadcast()
            sendJson(res, 200, await getState())
            return
          }

          if (route === '/config' && method === 'POST') {
            if (!guarded(req, res)) return
            const body = await readBody(req, 256 * 1024)
            let parsed
            try {
              parsed = JSON.parse(body.toString('utf8'))
            } catch {
              sendJson(res, 400, { error: '配置不是合法 JSON' })
              return
            }
            const next = store.setConfig(parsed)
            hub.broadcast()
            sendJson(res, 200, { config: next, revision: store.revision() })
            return
          }

          if (route === '/background' && method === 'POST') {
            if (!guarded(req, res)) return
            const mode = modeOf(url)
            const body = await readBody(req, MAX_BODY_BYTES)
            try {
              const meta = store.saveImage(mode, body)
              hub.broadcast()
              sendJson(res, 200, { image: meta, mode, revision: store.revision() })
            } catch (err) {
              sendJson(res, 400, { error: String((err && err.message) || err) })
            }
            return
          }

          if (route === '/background' && method === 'DELETE') {
            if (!guarded(req, res)) return
            const mode = modeOf(url)
            store.removeImage(mode)
            hub.broadcast()
            sendJson(res, 200, { ok: true, mode, revision: store.revision() })
            return
          }

          if (route === '/background' && (method === 'GET' || method === 'HEAD')) {
            if (!guarded(req, res)) return
            const mode = modeOf(url)
            const meta = store.getImage(mode)
            const bytes = store.readImage(mode)
            if (!meta || !bytes) {
              sendJson(res, 404, { error: '还没有上传背景' })
              return
            }
            const range = parseRange(req.headers.range, bytes.length)
            if (range) {
              res.writeHead(206, {
                'content-type': meta.mime,
                'cache-control': 'private, max-age=31536000, immutable',
                etag: `"${meta.version}"`,
                'accept-ranges': 'bytes',
                'content-range': `bytes ${range.start}-${range.end}/${bytes.length}`,
                'content-length': range.end - range.start + 1,
              })
              res.end(method === 'HEAD' ? undefined : bytes.subarray(range.start, range.end + 1))
              return
            }
            res.writeHead(200, {
              'content-type': meta.mime,
              'cache-control': 'private, max-age=31536000, immutable',
              etag: `"${meta.version}"`,
              'accept-ranges': 'bytes',
              'content-length': bytes.length,
            })
            res.end(method === 'HEAD' ? undefined : bytes)
            return
          }

          if (route === '/export.zip' && method === 'GET') {
            if (!guarded(req, res)) return
            const pack = buildPack(store)
            res.writeHead(200, {
              'content-type': 'application/zip',
              'content-disposition': `attachment; filename="dsh-appearance-${new Date().toISOString().slice(0, 10)}.zip"`,
              'cache-control': 'no-store',
              'content-length': pack.length,
            })
            res.end(pack)
            return
          }

          if (route === '/import.zip' && method === 'POST') {
            if (!guarded(req, res)) return
            const body = await readBody(req, MAX_IMPORT_BYTES)
            try {
              const config = applyPack(store, body)
              hub.broadcast()
              sendJson(res, 200, { ok: true, config, revision: store.revision() })
            } catch (err) {
              sendJson(res, 400, { error: String((err && err.message) || err) })
            }
            return
          }

          if (route === '/events' && method === 'GET') {
            if (!guarded(req, res)) return
            res.writeHead(200, {
              'content-type': 'text/event-stream; charset=utf-8',
              'cache-control': 'no-cache, no-transform',
              connection: 'keep-alive',
              'x-accel-buffering': 'no',
            })
            res.write(`retry: 3000\n\n`)
            res.write(`event: state\ndata: ${JSON.stringify(getState())}\n\n`)
            const unsubscribe = hub.subscribe(res)
            const heartbeat = setInterval(() => {
              try {
                res.write(': ping\n\n')
              } catch {
                /* ignore */
              }
            }, HEARTBEAT_MS)
            if (typeof heartbeat.unref === 'function') heartbeat.unref()
            const cleanup = () => {
              clearInterval(heartbeat)
              unsubscribe()
            }
            req.on('close', cleanup)
            res.on('close', cleanup)
            return
          }

          if (route === '/health') {
            sendJson(res, 200, { ok: true, revision: store.revision() })
            return
          }

          if (!acceptsJson(req) && (method === 'GET' || method === 'HEAD')) {
            res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
            res.end('not found')
            return
          }
          sendJson(res, 404, { error: '未知接口' })
        } catch (err) {
          const status = Number(err && err.status) || 500
          if (!res.headersSent) {
            sendJson(res, status, { error: String((err && err.message) || err) })
          } else {
            try {
              res.end()
            } catch {
              /* ignore */
            }
          }
          try {
            log && log('warn', `route failed: ${String((err && err.message) || err)}`)
          } catch {
            /* ignore */
          }
        }
      },
    }),
  )

  return () => {
    for (const dispose of disposers) {
      try {
        dispose()
      } catch {
        /* ignore */
      }
    }
    try {
      usage.flush()
    } catch {
      /* ignore */
    }
    hub.closeAll()
    try {
      log && log('info', 'routes disposed')
    } catch {
      /* ignore */
    }
  }
}
