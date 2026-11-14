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
    updatedAt: Number(meta.updatedAt) || Date.now(),
  }
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
      const meta = images.get(safeMode(mode))
      return meta ? { ...meta } : null
    },
    getImages() {
      return {
        light: images.get('light') ? { ...images.get('light') } : null,
        dark: images.get('dark') ? { ...images.get('dark') } : null,
      }
    },
    saveImage(mode, buf) {
      if (!Buffer.isBuffer(buf) || buf.length === 0) throw new Error('空背景文件')
      if (buf.length > MAX_IMAGE_BYTES) throw new Error('背景文件超过 80MB 上限')
      const detected = detectImageMime(buf)
      if (!detected) throw new Error('不支持的格式（图片 png/jpeg/gif/webp/avif，视频 mp4/webm/ogv）')
      const m = safeMode(mode)
      const { bin, meta: metaFile } = pathsFor(m)
      const version = `${Date.now().toString(36)}-${crypto.randomBytes(4).toString('hex')}`
      writeAtomic(bin, buf)
      const meta = {
        version,
        mime: detected.mime,
        kind: detected.kind,
        bytes: buf.length,
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
