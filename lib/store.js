import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

export const MAX_IMAGE_BYTES = 80 * 1024 * 1024
export const MODES = ['light', 'dark']

const GLASS_MODES = new Set(['none', 'translucent', 'frosted', 'liquid'])
const FIT_MODES = new Set(['cover', 'contain'])
const BLUR_TYPES = new Set(['gaussian', 'linear'])
const THEME_MODES = new Set(['default', 'auto', 'custom'])
const MIME_OK = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif', 'video/mp4', 'video/webm', 'video/ogg'])
const HEX = /^#[0-9a-fA-F]{6}$/
const VERSION_RE = /^[a-z0-9-]{1,48}$/

function clamp(n, min, max, fallback) {
  const v = Number(n)
  if (!Number.isFinite(v)) return fallback
  return Math.min(max, Math.max(min, v))
}

function hexOr(value, fallback) {
  return typeof value === 'string' && HEX.test(value) ? value.toLowerCase() : fallback
}

function normalizeBackground(raw) {
  const bg = raw && typeof raw === 'object' ? raw : {}
  return {
    zoom: Number(clamp(bg.zoom, 1, 4, 1).toFixed(3)),
    posX: Number(clamp(bg.posX, 0, 1, 0.5).toFixed(4)),
    posY: Number(clamp(bg.posY, 0, 1, 0.5).toFixed(4)),
    fit: FIT_MODES.has(bg.fit) ? bg.fit : 'cover',
    blur: Math.round(clamp(bg.blur, 0, 32, 0)),
    blurType: BLUR_TYPES.has(bg.blurType) ? bg.blurType : 'gaussian',
    opacity: Math.round(clamp(bg.opacity, 0, 100, 100)),
  }
}

function normalizeGlass(raw) {
  const glass = raw && typeof raw === 'object' ? raw : {}
  const regions = glass.regions && typeof glass.regions === 'object' ? glass.regions : {}
  return {
    mode: GLASS_MODES.has(glass.mode) ? glass.mode : 'frosted',
    strength: Math.round(clamp(glass.strength, 0, 100, 55)),
    radius: Math.round(clamp(glass.radius, 0, 28, 14)),
    answer: glass.answer !== false,
    regions: {
      conversation: regions.conversation !== false,
      sidebar: regions.sidebar !== false,
      panels: regions.panels !== false,
      dialogs: regions.dialogs !== false,
    },
  }
}

function normalizeTheme(raw) {
  const theme = raw && typeof raw === 'object' ? raw : {}
  const palette = Array.isArray(theme.palette)
    ? theme.palette.filter((c) => typeof c === 'string' && HEX.test(c)).slice(0, 8).map((c) => c.toLowerCase())
    : []
  return {
    mode: THEME_MODES.has(theme.mode) ? theme.mode : 'default',
    color: hexOr(theme.color, '#5b8dff'),
    palette,
  }
}

function normalizeProfile(raw, fallbackTheme) {
  const src = raw && typeof raw === 'object' ? raw : {}
  return {
    background: normalizeBackground(src.background),
    glass: normalizeGlass(src.glass),
    theme: normalizeTheme(src.theme || fallbackTheme),
  }
}

export function DEFAULT_CONFIG_V2() {
  return {
    version: 2,
    profiles: {
      light: normalizeProfile(null),
      dark: normalizeProfile(null),
    },
    ui: { showUsage: true },
  }
}

export function normalizeConfig(raw) {
  const src = raw && typeof raw === 'object' ? raw : {}
  const legacyTheme = normalizeTheme(src.theme)
  const srcProfiles = src.profiles && typeof src.profiles === 'object' ? src.profiles : {}
  const legacyBackground = src.background
  const legacyGlass = src.glass
  const legacy = legacyBackground || legacyGlass ? { background: legacyBackground, glass: legacyGlass } : null
  const light = srcProfiles.light || legacy
  const dark = srcProfiles.dark || legacy
  const ui = src.ui && typeof src.ui === 'object' ? src.ui : {}
  return {
    version: 2,
    profiles: {
      light: normalizeProfile(light, legacyTheme),
      dark: normalizeProfile(dark, legacyTheme),
    },
    ui: {
      showUsage: ui.showUsage !== false,
    },
  }
}

function readJson(file) {
  try {
    const text = fs.readFileSync(file, 'utf8')
    if (!text.trim()) return null
    return JSON.parse(text)
  } catch {
    return null
  }
}

function writeAtomic(file, data) {
  const dir = path.dirname(file)
  fs.mkdirSync(dir, { recursive: true })
  const tmp = `${file}.tmp-${process.pid}-${Date.now().toString(36)}`
  fs.writeFileSync(tmp, data)
  fs.renameSync(tmp, file)
}

function backupCorrupt(file) {
  try {
    if (!fs.existsSync(file)) return
    const target = `${file}.bad-${Date.now().toString(36)}`
    fs.renameSync(file, target)
  } catch {
    try {
      fs.rmSync(file, { force: true })
    } catch {
      /* ignore */
    }
  }
}

export function detectImageMime(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 12) return null
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { mime: 'image/png', ext: 'png', kind: 'image' }
  }
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { mime: 'image/jpeg', ext: 'jpg', kind: 'image' }
  }
  const head = buf.toString('ascii', 0, 6)
  if (head === 'GIF87a' || head === 'GIF89a') {
    return { mime: 'image/gif', ext: 'gif', kind: 'image' }
  }
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    return { mime: 'image/webp', ext: 'webp', kind: 'image' }
  }
  const brand = buf.toString('ascii', 4, 12)
  if (brand.startsWith('ftypavi') || brand.startsWith('ftypavis')) {
    return { mime: 'image/avif', ext: 'avif', kind: 'image' }
  }
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) {
    return { mime: 'video/webm', ext: 'webm', kind: 'video' }
  }
  if (buf.toString('ascii', 0, 4) === 'OggS') {
    return { mime: 'video/ogg', ext: 'ogv', kind: 'video' }
  }
  if (buf.toString('ascii', 4, 8) === 'ftyp') {
    const videoBrand = brand.replace(/^ftyp/, '')
    if (/^(isom|iso2|iso4|iso5|iso6|mp41|mp42|avc1|dash|mmp4|M4V|qt\s)/.test(videoBrand)) {
      return { mime: 'video/mp4', ext: 'mp4', kind: 'video' }
    }
  }
  return null
}

function safeMode(mode) {
  return mode === 'dark' ? 'dark' : 'light'
}

function normalizedMeta(meta, file) {
  if (!meta || typeof meta !== 'object') return null
  if (typeof meta.version !== 'string' || !VERSION_RE.test(meta.version)) return null
  if (typeof meta.mime !== 'string' || !MIME_OK.has(meta.mime)) return null
  if (!fs.existsSync(file)) return null
  let bytes = Number(meta.bytes)
  if (!Number.isFinite(bytes) || bytes <= 0) {
    try {
      bytes = fs.statSync(file).size
    } catch {
      return null
    }
  }
  return {
    version: meta.version,
    mime: meta.mime,
    kind: meta.kind === 'video' || meta.mime.startsWith('video/') ? 'video' : 'image',
    bytes,
    width: Number(meta.width) > 0 ? Math.round(Number(meta.width)) : 0,
    height: Number(meta.height) > 0 ? Math.round(Number(meta.height)) : 0,
    updatedAt: Number(meta.updatedAt) || Date.now(),
  }
}


function readUInt24LE(buf, off) {
  return buf[off] | (buf[off + 1] << 8) | (buf[off + 2] << 16)
}

function imageDimensions(buf, mime) {
  try {
    if (mime === 'image/png' && buf.length >= 24 && buf.toString('ascii', 1, 4) === 'PNG') {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
    }
    if (mime === 'image/gif' && buf.length >= 10 && buf.toString('ascii', 0, 3) === 'GIF') {
      return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) }
    }
    if (mime === 'image/jpeg' && buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2
      while (i + 9 < buf.length) {
        if (buf[i] !== 0xff) { i += 1; continue }
        const code = buf[i + 1]
        if (code === 0xd8 || code === 0xd9) { i += 2; continue }
        const size = buf.readUInt16BE(i + 2)
        if (size < 2) break
        const isSof = code >= 0xc0 && code <= 0xcf && code !== 0xc4 && code !== 0xc8 && code !== 0xcc
        if (isSof) return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) }
        i += 2 + size
      }
      return null
    }
    if (mime === 'image/webp' && buf.length >= 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
      const kind = buf.toString('ascii', 12, 16)
      if (kind === 'VP8X') return { width: 1 + readUInt24LE(buf, 24), height: 1 + readUInt24LE(buf, 27) }
      if (kind === 'VP8L') {
        const b = buf.readUInt32LE(21)
        return { width: 1 + (b & 0x3fff), height: 1 + ((b >> 14) & 0x3fff) }
      }
      if (kind === 'VP8 ') {
        for (let i = 20; i + 10 < buf.length; i += 1) {
          if (buf[i] === 0x9d && buf[i + 1] === 0x01 && buf[i + 2] === 0x2a) {
            return { width: buf.readUInt16LE(i + 3) & 0x3fff, height: buf.readUInt16LE(i + 5) & 0x3fff }
          }
        }
      }
    }
  } catch {
    return null
  }
  return null
}

export function createStore(dir) {
  fs.mkdirSync(dir, { recursive: true })
  const configFile = path.join(dir, 'config.json')
  const legacyImage = path.join(dir, 'background.bin')
  const legacyMeta = path.join(dir, 'background.json')

  let rawConfig = null
  let needsWrite = false
  try {
    const text = fs.readFileSync(configFile, 'utf8')
    rawConfig = text.trim() ? JSON.parse(text) : null
  } catch {
    rawConfig = null
  }
  if (rawConfig === null && fs.existsSync(configFile)) {
    backupCorrupt(configFile)
    needsWrite = true
  }
  let config = normalizeConfig(rawConfig || DEFAULT_CONFIG_V2())
  if (rawConfig === null || rawConfig.version !== 2) needsWrite = true

  // v1 stored a single wallpaper. Copy it to both mode slots so existing users
  // keep their background after upgrading; the old pair is renamed as a backup.
  const images = new Map()

  function backfillDims(mode) {
    const meta = images.get(mode)
    if (!meta) return null
    if (meta.width > 0 && meta.height > 0) return { ...meta }
    if (meta.kind !== 'image') return { ...meta }
    try {
      const buf = fs.readFileSync(pathsFor(mode).bin)
      const size = imageDimensions(buf, meta.mime)
      if (size && size.width > 0 && size.height > 0) {
        const next = { ...meta, width: size.width, height: size.height }
        writeAtomic(pathsFor(mode).meta, JSON.stringify(next, null, 2))
        images.set(mode, next)
        return { ...next }
      }
    } catch {
      /* keep the meta as-is */
    }
    return { ...meta }
  }
  const pathsFor = (mode) => {
    const m = safeMode(mode)
    return { bin: path.join(dir, `background-${m}.bin`), meta: path.join(dir, `background-${m}.json`) }
  }
  let legacy = null
  try {
    const meta = normalizedMeta(readJson(legacyMeta), legacyImage)
    if (meta) {
      const bytes = fs.readFileSync(legacyImage)
      legacy = { meta, bytes }
    }
  } catch {
    legacy = null
  }
  for (const mode of MODES) {
    const { bin, meta } = pathsFor(mode)
    const parsed = normalizedMeta(readJson(meta), bin)
    if (parsed) {
      images.set(mode, parsed)
    } else if (legacy) {
      try {
        writeAtomic(bin, legacy.bytes)
        writeAtomic(meta, JSON.stringify(legacy.meta, null, 2))
        images.set(mode, { ...legacy.meta })
        needsWrite = true
      } catch {
        /* keep going */
      }
    }
  }
  if (legacy) {
    for (const file of [legacyImage, legacyMeta]) {
      try {
        fs.renameSync(file, `${file}.legacy-${Date.now().toString(36)}`)
      } catch {
        /* ignore */
      }
    }
  }

  if (needsWrite) {
    try {
      writeAtomic(configFile, JSON.stringify(config, null, 2))
    } catch {
      /* read-only profile: keep defaults in memory */
    }
  }

  let revision = 0
  const bump = () => {
    revision += 1
    return revision
  }

  return {
    dir,
    revision: () => revision,
    configPath: configFile,
    imagePath: (mode) => pathsFor(mode).bin,
    getConfig() {
      return normalizeConfig(config)
    },
    setConfig(next) {
      config = normalizeConfig(next)
      writeAtomic(configFile, JSON.stringify(config, null, 2))
      bump()
      return normalizeConfig(config)
    },
    resetConfig() {
      config = normalizeConfig(DEFAULT_CONFIG_V2())
      writeAtomic(configFile, JSON.stringify(config, null, 2))
      bump()
      return normalizeConfig(config)
    },
    getImage(mode) {
      const m = safeMode(mode)
      return backfillDims(m)
    },
    getImages() {
      return { light: backfillDims('light'), dark: backfillDims('dark') }
    },
    saveImage(mode, buf, dims) {
      if (!Buffer.isBuffer(buf) || buf.length === 0) throw new Error('空背景文件')
      if (buf.length > MAX_IMAGE_BYTES) throw new Error('背景文件超过 80MB 上限')
      const detected = detectImageMime(buf)
      if (!detected) throw new Error('不支持的格式（图片 png/jpeg/gif/webp/avif，视频 mp4/webm/ogv）')
      const m = safeMode(mode)
      const { bin, meta: metaFile } = pathsFor(m)
      const version = `${Date.now().toString(36)}-${crypto.randomBytes(4).toString('hex')}`
      writeAtomic(bin, buf)
      const parsedW = dims && Number(dims.width) > 0 ? Math.round(Number(dims.width)) : 0
      const parsedH = dims && Number(dims.height) > 0 ? Math.round(Number(dims.height)) : 0
      const meta = {
        version,
        mime: detected.mime,
        kind: detected.kind,
        bytes: buf.length,
        width: parsedW,
        height: parsedH,
        updatedAt: Date.now(),
      }
      writeAtomic(metaFile, JSON.stringify(meta, null, 2))
      images.set(m, meta)
      bump()
      return { ...meta }
    },
    removeImage(mode) {
      const m = safeMode(mode)
      const { bin, meta } = pathsFor(m)
      for (const file of [bin, meta]) {
        try {
          fs.rmSync(file, { force: true })
        } catch {
          /* ignore */
        }
      }
      images.delete(m)
      bump()
    },
    readImage(mode) {
      const m = safeMode(mode)
      if (!images.has(m)) return null
      try {
        return fs.readFileSync(pathsFor(m).bin)
      } catch {
        return null
      }
    },
    readUsage() {
      const parsed = readJson(path.join(dir, 'usage.json'))
      if (!parsed || typeof parsed !== 'object' || !parsed.days || typeof parsed.days !== 'object') {
        return { days: {} }
      }
      return parsed
    },
    writeUsage(data) {
      try {
        writeAtomic(path.join(dir, 'usage.json'), JSON.stringify(data))
      } catch {
        /* ignore: usage is best-effort */
      }
    },
    backupCorruptConfig() {
      backupCorrupt(configFile)
    },
  }
}
