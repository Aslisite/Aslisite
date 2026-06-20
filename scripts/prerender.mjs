import { build, createServer } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { filterPublishedBlogs } from '../src/api/blog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

async function fetchBlogs() {
  try {
    console.log('Fetching blog data from SheetDB...');
    const res = await fetch('https://sheetdb.io/api/v1/qa8ftkry70910');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return filterPublishedBlogs(data);
  } catch (error) {
    console.error('Error fetching blogs for SSG:', error);
    return [];
  }
}

async function runBuild() {
  // 1. Run Vite client build first
  console.log('Building Vite client app...');
  await build({
    configFile: path.join(projectRoot, 'vite.config.js'),
    build: {
      outDir: 'dist',
      ssrManifest: true,
      emptyOutDir: true,
    },
  });

  // 2. Prepare routes
  const blogs = await fetchBlogs();
  const routes = [
    '/',
    '/blog',
    '/privacy-policy',
    '/services/web-development',
    '/services/ecommerce-solutions',
    '/services/custom-software',
    '/services/seo-services',
    '/products/sheet-automation',
    '/products/sheet-automation/welcome',
  ];
  blogs.forEach((blog) => {
    if (blog.slug) routes.push(`/blog/${blog.slug}`);
  });

  console.log(`Generating ${routes.length} static pages...`);

  // 3. Setup Vite server for SSR loading
  const vite = await createServer({
    configFile: path.join(projectRoot, 'vite.config.js'),
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  });

  try {
    const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');
    const templateHtml = await readFile(indexHtmlPath, 'utf8');

    // 4. Render and save each route
    for (const url of routes) {
      console.log(`Pre-rendering: ${url}`);

      const { html, helmet } = render(url, { blogs });

      let prerenderedHtml = templateHtml.replace(
        '<div id="root" tabindex="-1"></div>',
        `<div id="root" tabindex="-1">${html}</div>`,
      );

      // Inject initial data for client-side hydration
      const initialDataScript = `\n    <script>window.__INITIAL_DATA__ = ${JSON.stringify({ blogs })};</script>`;
      prerenderedHtml = prerenderedHtml.replace('</head>', `${initialDataScript}\n  </head>`);

      if (helmet) {
        const helmetTags = `
    ${helmet.title ? helmet.title.toString() : ''}
    ${helmet.meta ? helmet.meta.toString() : ''}
    ${helmet.link ? helmet.link.toString() : ''}
    ${helmet.script ? helmet.script.toString() : ''}
`;
        prerenderedHtml = prerenderedHtml.replace('</head>', `${helmetTags}\n  </head>`);
      }

      const routePath = url === '/' ? '' : url;
      const targetDir = path.join(distDir, routePath);

      await mkdir(targetDir, { recursive: true });
      const targetFile = path.join(targetDir, 'index.html');

      await writeFile(targetFile, prerenderedHtml, 'utf8');
    }
  } catch (err) {
    console.error('Error during pre-rendering:', err);
  } finally {
    await vite.close();
  }

  console.log('Static Site Generation complete!');

  // 5. Generate dynamic sitemap.xml
  await generateSitemap(routes);
}

async function generateSitemap(routes) {
  console.log('Generating dynamic sitemap.xml...');
  const baseUrl = 'https://aslisite.com';
  const today = new Date().toISOString().split('T')[0];

  const sitemapRoutes = routes.filter((r) => r !== '/products/sheet-automation/welcome');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
  .map((route) => {
    const url = `${baseUrl}${route === '/' ? '' : route}`;
    let priority = '0.5';
    let changefreq = 'weekly';

    if (route === '/') {
      priority = '1.0';
      changefreq = 'daily';
    } else if (route === '/blog') {
      priority = '0.8';
      changefreq = 'daily';
    }

    return `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  await writeFile(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
  console.log('sitemap.xml generated in dist/');
}

await runBuild();
