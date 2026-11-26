import fs from 'node:fs'
import sharp from 'sharp'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="64" height="64" fill="none">
  <rect width="40" height="40" rx="9" fill="#121211"/>
  <rect width="40" height="40" rx="9" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <path d="M6 31C14 31 20 26 25 21" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
  <polygon points="36,9 15,20 24,21" fill="#10B981"/>
  <polygon points="36,9 24,21 21,28" fill="#047857"/>
  <line x1="36" y1="9" x2="24" y2="21" stroke="rgba(255, 255, 255, 0.45)" stroke-width="0.85" stroke-linecap="round"/>
  <circle cx="9" cy="31" r="1.5" fill="#10B981" fill-opacity="0.6"/>
  <circle cx="15" cy="28.5" r="1.2" fill="#10B981" fill-opacity="0.8"/>
</svg>`

fs.writeFileSync('public/favicon.svg', svg)
console.log('Saved public/favicon.svg')

const png32 = await sharp(Buffer.from(svg)).resize(32, 32).png().toBuffer()
const png16 = await sharp(Buffer.from(svg)).resize(16, 16).png().toBuffer()

// Write standard ICO header with 16x16 and 32x32 images
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // ICO type (1)
header.writeUInt16LE(2, 4) // 2 images

const entry16 = Buffer.alloc(16)
entry16.writeUInt8(16, 0)
entry16.writeUInt8(16, 1)
entry16.writeUInt8(0, 2)
entry16.writeUInt8(0, 3)
entry16.writeUInt16LE(1, 4)
entry16.writeUInt16LE(32, 6)
entry16.writeUInt32LE(png16.length, 8)
entry16.writeUInt32LE(6 + 32, 12) // offset: header (6) + 2 entries (32) = 38

const entry32 = Buffer.alloc(16)
entry32.writeUInt8(32, 0)
entry32.writeUInt8(32, 1)
entry32.writeUInt8(0, 2)
entry32.writeUInt8(0, 3)
entry32.writeUInt16LE(1, 4)
entry32.writeUInt16LE(32, 6)
entry32.writeUInt32LE(png32.length, 8)
entry32.writeUInt32LE(38 + png16.length, 12)

const ico = Buffer.concat([header, entry16, entry32, png16, png32])
fs.writeFileSync('public/favicon.ico', ico)
fs.writeFileSync('src/app/favicon.ico', ico)
console.log('Saved public/favicon.ico and src/app/favicon.ico (' + ico.length + ' bytes)')
