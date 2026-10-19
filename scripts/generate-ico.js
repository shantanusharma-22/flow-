import fs from 'fs';
import path from 'path';

// Generate a valid ICO file from PNG buffer
const pngPath = path.resolve(process.cwd(), 'public/flow_logo.png');
if (fs.existsSync(pngPath)) {
  const pngBuffer = fs.readFileSync(pngPath);
  
  // Minimal valid ICO header for a PNG-encoded icon frame
  // ICONDIR: 6 bytes (idReserved: 0, idType: 1, idCount: 1)
  // ICONDIRENTRY: 16 bytes (width, height, colorCount, reserved, planes, bpp, bytesInRes, imageOffset)
  const icoHeader = Buffer.alloc(6 + 16);
  
  // idReserved = 0 (2 bytes, LE)
  icoHeader.writeUInt16LE(0, 0);
  // idType = 1 for icon (2 bytes, LE)
  icoHeader.writeUInt16LE(1, 2);
  // idCount = 1 image (2 bytes, LE)
  icoHeader.writeUInt16LE(1, 4);
  
  // ICONDIRENTRY
  icoHeader.writeUInt8(0, 6); // 0 means 256px width
  icoHeader.writeUInt8(0, 7); // 0 means 256px height
  icoHeader.writeUInt8(0, 8); // colorCount = 0 (no palette)
  icoHeader.writeUInt8(0, 9); // reserved = 0
  icoHeader.writeUInt16LE(1, 10); // color planes = 1
  icoHeader.writeUInt16LE(32, 12); // bits per pixel = 32
  icoHeader.writeUInt32LE(pngBuffer.length, 14); // bytesInRes
  icoHeader.writeUInt32LE(22, 18); // imageOffset = 6 + 16 = 22
  
  const finalIco = Buffer.concat([icoHeader, pngBuffer]);
  fs.writeFileSync(path.resolve(process.cwd(), 'Flow.ico'), finalIco);
  console.log(`Successfully generated Flow.ico (${finalIco.length} bytes)`);
} else {
  console.error('PNG not found:', pngPath);
}
