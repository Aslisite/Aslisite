import { build } from 'vite';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { filterPublishedBlogs } from '../src/api/blog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const ssrOutDir = path.join(projectRoot, 'dist-ssr');
const indexHtmlPath = path.join(distDir, 'index.html');
const blogCachePath = path.join(projectRoot, '.blog-cache.json');

async function fetchBlogs() {
  try {
    console.log('Fetching blog data from SheetDB...');
    const res = await fetch('https://sheetdb.io/api/v1/qa8ftkry70910');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    const blogs = filterPublishedBlogs(data);

    // Cache successful response for fallback
    await writeFile(blogCachePath, JSON.stringify(blogs, null, 2), 'utf8');
    console.log('Blog data cached successfully.');

    return blogs;
  } catch (error) {
    console.error('Error fetching blogs from SheetDB:', error.message);

    // Attempt to use cached data as fallback
    try {
      const cached = await readFile(blogCachePath, 'utf8');
      const blogs = JSON.parse(cached);
      console.log(`Using cached blog data (${blogs.length} posts) as fallback.`);
      return blogs;
    } catch {
      console.error('No cached blog data available. Proceeding without blogs.');
      return [];
    }
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

  // 2. Build SSR bundle (Rollup properly handles CJS/ESM interop)
  console.log('Building SSR bundle...');
  await build({
    configFile: path.join(projectRoot, 'vite.config.js'),
    build: {
      outDir: 'dist-ssr',
      ssr: true,
      rollupOptions: {
        input: path.join(projectRoot, 'src/entry-server.jsx'),
        // Externalize only Node built-ins and React (CJS).
        // Everything else (MUI, framer-motion, etc.) gets bundled
        // to avoid Node 24's strict ESM resolution issues.
        external: [
          'react',
          'react-dom',
          'react-dom/server',
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
        ],
      },
      emptyOutDir: true,
    },
    ssr: {
      // Force Vite to bundle these instead of externalizing
      noExternal: [/^(?!react|react-dom)/],
    },
  });

  // 3. Prepare routes
  const blogs = await fetchBlogs();
  const routes = [
    '/',
    '/blog',
    '/portfolio',
    '/privacy-policy',
    '/services/web-development',
    '/services/ecommerce-solutions',
    '/services/custom-software',
    '/services/seo-services',
    '/products/sheet-automation',
    '/tools',
    '/tools/gst-calculator',
    '/tools/invoice-generator',
    '/tools/quotation-generator',
    '/tools/whatsapp-link-generator',
    '/tools/receipt-generator',
    '/tools/profit-margin-calculator',
    '/tools/upi-qr-generator',
    '/tools/break-even-calculator',
    '/tools/purchase-order-generator',
    '/tools/roas-calculator',
    '/tools/email-signature-generator',
    '/tools/image-compressor-resizer',
    '/tools/barcode-generator',
    '/tools/utm-campaign-url-builder',
    '/tools/qr-code-generator',
    '/tools/roi-calculator',
    '/tools/business-loan-calculator',
    '/tools/discount-sale-price-calculator',
    '/tools/meta-tag-generator',
    '/tools/business-card-maker',
  ];
  blogs.forEach((blog) => {
    if (blog.slug) routes.push(`/blog/${blog.slug}`);
  });

  console.log(`Generating ${routes.length} static pages...`);

  // 4. Import the SSR bundle
  const ssrEntryPath = path.join(ssrOutDir, 'entry-server.js');
  const { render } = await import(pathToFileURL(ssrEntryPath).href);
  const templateHtml = await readFile(indexHtmlPath, 'utf8');

  // 5. Render and save each route (including a 404 page)
  const allRoutes = [...routes, '/404-not-found'];
  let successCount = 0;
  let failCount = 0;

  for (const url of allRoutes) {
    try {
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
        // Replace the default title with the page-specific title from Helmet
        const helmetTitle = helmet.title ? helmet.title.toString() : '';
        if (helmetTitle) {
          prerenderedHtml = prerenderedHtml.replace(
            /<title>[^<]*<\/title>/,
            helmetTitle,
          );
        }

        // Replace the default meta description with the page-specific one from Helmet
        const helmetMeta = helmet.meta ? helmet.meta.toString() : '';
        if (helmetMeta.includes('name="description"')) {
          // Remove the original multi-line meta description tag from the template
          prerenderedHtml = prerenderedHtml.replace(
            /<meta\s[^>]*name="description"[^>]*\/?>/s,
            '',
          );
        }

        // Inject all helmet-generated link and script tags, plus any remaining meta tags
        const helmetLink = helmet.link ? helmet.link.toString() : '';
        const helmetScript = helmet.script ? helmet.script.toString() : '';

        const helmetTags = `
    ${helmetMeta}
    ${helmetLink}
    ${helmetScript}
`;
        prerenderedHtml = prerenderedHtml.replace('</head>', `${helmetTags}\n  </head>`);
      }

      const routePath = url === '/' ? '' : url;
      const targetDir = path.join(distDir, routePath);

      await mkdir(targetDir, { recursive: true });
      const targetFile = path.join(targetDir, 'index.html');

      // Special case: save the 404 route as 404.html at the root for Vercel
      if (url === '/404-not-found') {
        await writeFile(path.join(distDir, '404.html'), prerenderedHtml, 'utf8');
      } else {
        await writeFile(targetFile, prerenderedHtml, 'utf8');
      }
      successCount++;
    } catch (err) {
      console.error(`  Error pre-rendering ${url}:`, err.message);
      failCount++;
    }
  }

  console.log(`\nStatic Site Generation complete! ${successCount} pages generated, ${failCount} failed.`);

  if (failCount > 0) {
    console.warn('WARNING: Some pages failed to pre-render. They will fall back to client-side rendering.');
  }

  // 6. Clean up SSR bundle
  await rm(ssrOutDir, { recursive: true, force: true });

  // 7. Generate dynamic sitemap.xml
  await generateSitemap(routes, blogs);
}

async function generateSitemap(routes, blogs = []) {
  console.log('Generating dynamic sitemap.xml...');
  const baseUrl = 'https://aslisite.com';
  const today = new Date().toISOString().split('T')[0];

  // Build per-blog maps keyed by route
  const blogImageMap = {};
  const blogLastmodMap = {};
  blogs.forEach((blog) => {
    if (!blog.slug) return;
    const route = `/blog/${blog.slug}`;

    if (blog.image) {
      blogImageMap[route] = blog.image;
    }

    // Use the most recent meaningful date field, fall back to today
    const candidate = blog.updatedAt || blog.date || blog.publishedAt || blog.createdAt;
    const ts = Date.parse(candidate);
    blogLastmodMap[route] = Number.isNaN(ts) ? today : new Date(ts).toISOString().split('T')[0];
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routes
  .map((route) => {
    const url = `${baseUrl}${route === '/' ? '' : route}`;
    const lastmod = blogLastmodMap[route] ?? today;

    const imageTag = blogImageMap[route]
      ? `\n    <image:image>\n      <image:loc>${blogImageMap[route]}</image:loc>\n    </image:image>`
      : '';

    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>${imageTag}
  </url>`;
  })
  .join('\n')}
</urlset>`;

  await writeFile(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
  console.log('sitemap.xml generated in dist/');
}

await runBuild();
