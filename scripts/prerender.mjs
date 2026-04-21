import { build, createServer } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

async function renderApp() {
  const vite = await createServer({
    configFile: path.join(projectRoot, 'vite.config.js'),
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  });

  try {
    const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');
    return render();
  } finally {
    await vite.close();
  }
}

async function runBuild() {
  const appHtml = await renderApp();

  await build({
    configFile: path.join(projectRoot, 'vite.config.js'),
    build: {
      outDir: 'dist',
      ssrManifest: true,
    },
  });
  const indexHtml = await readFile(indexHtmlPath, 'utf8');
  const prerenderedHtml = indexHtml.replace(
    '<div id="root" tabindex="-1"></div>',
    `<div id="root" tabindex="-1">${appHtml}</div>`
  );

  await writeFile(indexHtmlPath, prerenderedHtml, 'utf8');
}

await mkdir(distDir, { recursive: true });
await runBuild();
