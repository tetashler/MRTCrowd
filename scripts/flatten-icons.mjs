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

for (const file of FILES) {
  const path = join(PUBLIC_DIR, file);
  const input = await readFile(path);
  const output = await sharp(input)
    .flatten({ background: '#FFFFFF' })
    .png()
    .toBuffer();
  await writeFile(path, output);
  console.log(`Flattened ${file}`);
}
