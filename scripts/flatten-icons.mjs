import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

const FILES = [
  'web-app-manifest-192x192.png',
  'web-app-manifest-512x512.png',
  'apple-touch-icon.png',
];

// Replace any near-grey/near-white pixel (the baked-in transparency checker
// pattern from the original export) with pure white. Logo pixels have high
// chroma (R/G/B differ a lot), so they're preserved.
function isBackgroundPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  const brightness = (r + g + b) / 3;
  return chroma < 15 && brightness > 180;
}

for (const file of FILES) {
  const path = join(PUBLIC_DIR, file);
  const input = await readFile(path);
  const { data, info } = await sharp(input)
    .flatten({ background: '#FFFFFF' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = Buffer.from(data);
  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    if (isBackgroundPixel(r, g, b)) {
      pixels[i] = 255;
      pixels[i + 1] = 255;
      pixels[i + 2] = 255;
    }
  }

  const output = await sharp(pixels, { raw: { width, height, channels } })
    .png()
    .toBuffer();
  await writeFile(path, output);
  console.log(`Cleaned ${file}`);
}
