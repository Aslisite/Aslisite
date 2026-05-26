import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SERVICE_ACCOUNT_FILE = path.join(projectRoot, 'service_account.json');
const SITEMAP_FILE = path.join(projectRoot, 'dist', 'sitemap.xml');

async function getUrlsFromSitemap() {
  try {
    const sitemapContent = await fs.readFile(SITEMAP_FILE, 'utf8');
    const urlRegex = /<loc>(.*?)<\/loc>/g;
    const urls = [];
    let match;
    while ((match = urlRegex.exec(sitemapContent)) !== null) {
      urls.push(match[1]);
    }
    return urls;
  } catch (err) {
    console.error('Error reading sitemap. Make sure to build the project first (npm run build).');
    throw err;
  }
}

async function runIndexing() {
  try {
    if (process.env.VERCEL_ENV === 'preview') {
      console.log('Skipping Google Indexing API on Vercel preview deployment.');
      return;
    }

    console.log('Authenticating with Google...');
    let auth;

    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      console.log('Using credentials from environment variable...');
      auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
        scopes: ['https://www.googleapis.com/auth/indexing'],
      });
    } else {
      // Fallback to local file
      try {
        await fs.access(SERVICE_ACCOUNT_FILE);
      } catch {
        console.warn(`[Skip Indexing] Service account key not found at: ${SERVICE_ACCOUNT_FILE} and GOOGLE_SERVICE_ACCOUNT_JSON env var is not set.`);
        return; // Exit gracefully without failing the build
      }
      console.log('Using credentials from local service_account.json file...');
      auth = new google.auth.GoogleAuth({
        keyFile: SERVICE_ACCOUNT_FILE,
        scopes: ['https://www.googleapis.com/auth/indexing'],
      });
    }

    const authClient = await auth.getClient();
    console.log('Authentication successful!');

    const urls = await getUrlsFromSitemap();
    console.log(`Found ${urls.length} URLs in sitemap to index.`);

    const indexing = google.indexing('v3');

    for (const url of urls) {
      console.log(`Publishing URL: ${url}`);
      try {
        const response = await indexing.urlNotifications.publish({
          auth: authClient,
          requestBody: {
            url: url,
            type: 'URL_UPDATED',
          },
        });
        console.log(`Successfully published ${url}. Response status: ${response.status}`);
      } catch (publishErr) {
        console.error(`Failed to publish ${url}:`, publishErr.message);
      }
    }
    
    console.log('Finished pushing URLs to Google Indexing API.');
  } catch (err) {
    console.error('Error during indexing process:', err);
  }
}

runIndexing();
