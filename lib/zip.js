import zlib from 'node:zlib'

const SIG_LOCAL = 0x04034b50
const SIG_CENTRAL = 0x02014b50
const SIG_EOCD = 0x06054b50
const MAX_ENTRIES = 64
const MAX_TOTAL = 180 * 1024 * 1024
const MAX_NAME = 200

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i += 1) {
    let c = i
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[i] = c >>> 0
  }
  return table
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

export function safeEntryName(name) {
  if (typeof name !== 'string') return null
  const value = name.replace(/\\/g, '/')
  if (!value || value.length > MAX_NAME) return null
  if (value.startsWith('/') || /^[a-zA-Z]:/.test(value)) return null
  if (value.split('/').some((part) => part === '..' || part === '' || part === '.')) return null
  if (!/^[a-zA-Z0-9._/-]+$/.test(value)) return null
  return value
}

export function buildZip(entries) {
  if (!Array.isArray(entries) || entries.length > MAX_ENTRIES) throw new Error('压缩包条目过多')
  const locals = []
  const centrals = []
  let offset = 0
  for (const entry of entries) {
    const name = safeEntryName(entry && entry.name)
    if (!name) throw new Error('压缩包条目名不合法')
    const data = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data || '')
    if (data.length > MAX_TOTAL) throw new Error('压缩包内容过大')
    const deflated = zlib.deflateRawSync(data, { level: 9 })
    const useDeflate = deflated.length < data.length
    const payload = useDeflate ? deflated : data
    const method = useDeflate ? 8 : 0
    const crc = crc32(data)
    const nameBuf = Buffer.from(name, 'utf8')

    const local = Buffer.alloc(30 + nameBuf.length)
    local.writeUInt32LE(SIG_LOCAL, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(0, 6)
    local.writeUInt16LE(method, 8)
    local.writeUInt16LE(0, 10)
    local.writeUInt16LE(0, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(payload.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(nameBuf.length, 26)
    local.writeUInt16LE(0, 28)
    nameBuf.copy(local, 30)
    locals.push(local, payload)

    const central = Buffer.alloc(46 + nameBuf.length)
    central.writeUInt32LE(SIG_CENTRAL, 0)
    central.writeUInt16LE(20, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(0, 8)
    central.writeUInt16LE(method, 10)
    central.writeUInt16LE(0, 12)
    central.writeUInt16LE(0, 14)
    central.writeUInt32LE(crc, 16)
    central.writeUInt32LE(payload.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(nameBuf.length, 28)
    central.writeUInt16LE(0, 30)
    central.writeUInt16LE(0, 32)
    central.writeUInt16LE(0, 34)
    central.writeUInt16LE(0, 36)
    central.writeUInt32LE(0, 38)
    central.writeUInt32LE(offset, 42)
    nameBuf.copy(central, 46)
    centrals.push(central)

    offset += local.length + payload.length
    if (offset > MAX_TOTAL) throw new Error('压缩包内容过大')
  }

  const centralBuf = Buffer.concat(centrals)
  const eocd = Buffer.alloc(22)
  eocd.writeUInt32LE(SIG_EOCD, 0)
  eocd.writeUInt16LE(0, 4)
  eocd.writeUInt16LE(0, 6)
  eocd.writeUInt16LE(centrals.length, 8)
  eocd.writeUInt16LE(centrals.length, 10)
  eocd.writeUInt32LE(centralBuf.length, 12)
  eocd.writeUInt32LE(offset, 16)
  eocd.writeUInt16LE(0, 20)
  return Buffer.concat([...locals, centralBuf, eocd])
}

function findEocd(buf) {
  const start = Math.max(0, buf.length - 66 * 1024)
  for (let i = buf.length - 22; i >= start; i -= 1) {
    if (buf.readUInt32LE(i) === SIG_EOCD) return i
  }
  return -1
}

export function readZip(buf, limits) {
  if (!Buffer.isBuffer(buf) || buf.length < 22) throw new Error('不是有效的压缩包')
  const maxTotal = Math.min(Number(limits && limits.maxTotal) || MAX_TOTAL, MAX_TOTAL)
  const maxEntries = Math.min(Number(limits && limits.maxEntries) || MAX_ENTRIES, MAX_ENTRIES)
  const eocd = findEocd(buf)
  if (eocd < 0) throw new Error('压缩包缺少目录信息')
  const count = buf.readUInt16LE(eocd + 10)
  if (count === 0 || count > maxEntries) throw new Error('压缩包条目数量不合法')
  const cdSize = buf.readUInt32LE(eocd + 12)
  const cdOffset = buf.readUInt32LE(eocd + 16)
  if (cdSize === 0xffffffff || cdOffset === 0xffffffff) throw new Error('不支持 ZIP64')
  if (cdOffset + cdSize > eocd || cdOffset < 0) throw new Error('压缩包目录越界')

  const entries = new Map()
  let cursor = cdOffset
  let total = 0
  for (let i = 0; i < count; i += 1) {
    if (cursor + 46 > eocd || buf.readUInt32LE(cursor) !== SIG_CENTRAL) throw new Error('压缩包目录损坏')
    const flags = buf.readUInt16LE(cursor + 8)
    const method = buf.readUInt16LE(cursor + 10)
    const crc = buf.readUInt32LE(cursor + 16)
    const compSize = buf.readUInt32LE(cursor + 20)
    const size = buf.readUInt32LE(cursor + 24)
    const nameLen = buf.readUInt16LE(cursor + 28)
    const extraLen = buf.readUInt16LE(cursor + 30)
    const commentLen = buf.readUInt16LE(cursor + 32)
    const localOffset = buf.readUInt32LE(cursor + 42)
    if (flags & 0x1) throw new Error('不支持加密压缩包')
    if (compSize === 0xffffffff || size === 0xffffffff || localOffset === 0xffffffff) throw new Error('不支持 ZIP64')
    if (compSize > maxTotal || size > maxTotal) throw new Error('压缩包条目过大')
    const nameStart = cursor + 46
    const nameEnd = nameStart + nameLen
    if (nameEnd > buf.length) throw new Error('压缩包目录损坏')
    const name = safeEntryName(buf.toString('utf8', nameStart, nameEnd))
    if (!name) throw new Error('压缩包条目名不合法')
    if (entries.has(name)) throw new Error('压缩包条目重复')
    if (method !== 0 && method !== 8) throw new Error('不支持的压缩方式')
    const next = nameEnd + extraLen + commentLen
    if (next > buf.length) throw new Error('压缩包目录损坏')
    cursor = next

    if (localOffset + 30 > buf.length || buf.readUInt32LE(localOffset) !== SIG_LOCAL) throw new Error('压缩包条目损坏')
    const localNameLen = buf.readUInt16LE(localOffset + 26)
    const localExtraLen = buf.readUInt16LE(localOffset + 28)
    const dataStart = localOffset + 30 + localNameLen + localExtraLen
    const dataEnd = dataStart + compSize
    if (dataEnd > buf.length) throw new Error('压缩包条目越界')
    const payload = buf.subarray(dataStart, dataEnd)
    let data
    try {
      data = method === 8 ? zlib.inflateRawSync(payload, { maxOutputLength: Math.min(size, maxTotal - total) }) : Buffer.from(payload)
    } catch {
      throw new Error('压缩包解压失败')
    }
    if (data.length !== size) throw new Error('压缩包条目大小不一致')
    if (crc32(data) !== crc) throw new Error('压缩包条目校验失败')
    total += data.length
    if (total > maxTotal) throw new Error('压缩包解压后过大')
    entries.set(name, data)
  }
  return entries
}

export function zipLimits() {
  return { maxEntries: MAX_ENTRIES, maxTotal: MAX_TOTAL }
}
