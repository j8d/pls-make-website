// Builds the static assets the page serves: rasterizes original SVG art to
// responsive AVIF/WebP and copies the self-hosted OFL font files + licenses.
import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nm = join(root, 'node_modules');

const IMAGES = [{ src: 'art/big-sunset.svg', name: 'big-sunset', widths: [640, 1024, 1600, 2400] }];

const FONTS = [
  ['@fontsource-variable/space-grotesk', 'space-grotesk-latin-wght-normal.woff2'],
  ['@fontsource-variable/atkinson-hyperlegible-next', 'atkinson-hyperlegible-next-latin-wght-normal.woff2'],
  ['@fontsource-variable/jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2'],
  ['@fontsource/comic-neue', 'comic-neue-latin-400-normal.woff2'],
  ['@fontsource/comic-neue', 'comic-neue-latin-700-normal.woff2'],
  ['@fontsource-variable/fraunces', 'fraunces-latin-wght-normal.woff2'],
  ['@fontsource-variable/source-serif-4', 'source-serif-4-latin-wght-normal.woff2'],
  ['@fontsource/press-start-2p', 'press-start-2p-latin-400-normal.woff2'],
  ['@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff2'],
  ['@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-700-normal.woff2'],
];

await mkdir(join(root, 'site/img'), { recursive: true });
for (const img of IMAGES) {
  const svg = await readFile(join(root, img.src));
  for (const w of img.widths) {
    const base = sharp(svg, { density: 72 * (w / 2400) * 4 }).resize({ width: w });
    await base.clone().avif({ quality: 50, effort: 6 }).toFile(join(root, `site/img/${img.name}-${w}.avif`));
    await base.clone().webp({ quality: 72 }).toFile(join(root, `site/img/${img.name}-${w}.webp`));
  }
}

await mkdir(join(root, 'site/fonts/licenses'), { recursive: true });
for (const [pkg, file] of FONTS) {
  await copyFile(join(nm, pkg, 'files', file), join(root, 'site/fonts', file));
  const family = pkg.split('/')[1];
  await writeFile(join(root, 'site/fonts/licenses', `${family}.txt`), await readFile(join(nm, pkg, 'LICENSE')));
}
console.log('assets ok');
