import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SERVICE_ACCOUNT_FILE = path.join(projectRoot, 'service_account.json');
const SITEMAP_FILE = path.join(projectRoot, 'dist', 'sitemap.xml');
const INDEXED_URLS_CACHE = path.join(projectRoot, '.indexed-urls.json');

// Configuration
const DAILY_QUOTA_LIMIT = 200;
const DELAY_BETWEEN_REQUESTS_MS = 300; // 300ms between calls to stay well under rate limits
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

// ─── Helpers ────────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

/**
 * Load the previously indexed URLs cache.
 * Returns a Set of URL strings that were successfully submitted last time.
 */
async function loadIndexedCache() {
  try {
    const data = await fs.readFile(INDEXED_URLS_CACHE, 'utf8');
    const parsed = JSON.parse(data);
    return new Set(parsed.urls || []);
  } catch {
    // No cache exists yet — treat all URLs as new
    return new Set();
  }
}

/**
 * Save the set of successfully indexed URLs for next comparison.
 */
async function saveIndexedCache(urlSet) {
  const payload = {
    updatedAt: new Date().toISOString(),
    urls: [...urlSet],
  };
  await fs.writeFile(INDEXED_URLS_CACHE, JSON.stringify(payload, null, 2), 'utf8');
}

/**
 * Determine which URLs need to be submitted.
 * - New URLs (not in the previous cache) are always submitted.
 * - Removed URLs get a URL_DELETED notification.
 * - Existing URLs are skipped (already indexed, nothing changed).
 */
function diffUrls(currentUrls, previouslyIndexed) {
  const currentSet = new Set(currentUrls);

  const toUpdate = currentUrls.filter((url) => !previouslyIndexed.has(url));
  const toDelete = [...previouslyIndexed].filter((url) => !currentSet.has(url));

  return { toUpdate, toDelete };
}

/**
 * Publish a single URL with retry logic.
 */
async function publishWithRetry(indexing, authClient, url, type, attempt = 1) {
  try {
    const response = await indexing.urlNotifications.publish({
      auth: authClient,
      requestBody: { url, type },
    });
    return { success: true, status: response.status };
  } catch (err) {
    const status = err?.response?.status || err?.code;
    const isRetryable = status === 429 || status === 503 || status >= 500;

    if (isRetryable && attempt <= MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * attempt; // linear backoff
      console.warn(`  Retrying ${url} (attempt ${attempt + 1}) after ${delay}ms...`);
      await sleep(delay);
      return publishWithRetry(indexing, authClient, url, type, attempt + 1);
    }

    return { success: false, error: err.message };
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────────

async function runIndexing() {
  try {
    if (process.env.VERCEL_ENV === 'preview') {
      console.log('Skipping Google Indexing API on Vercel preview deployment.');
      return;
    }

    // ── Auth ──────────────────────────────────────────────────────────────────
    console.log('Authenticating with Google...');
    let auth;

    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      console.log('Using credentials from environment variable...');
      auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
        scopes: ['https://www.googleapis.com/auth/indexing'],
      });
    } else {
      try {
        await fs.access(SERVICE_ACCOUNT_FILE);
      } catch {
        console.warn(
          `[Skip Indexing] Service account key not found at: ${SERVICE_ACCOUNT_FILE} and GOOGLE_SERVICE_ACCOUNT_JSON env var is not set.`,
        );
        return;
      }
      console.log('Using credentials from local service_account.json file...');
      auth = new google.auth.GoogleAuth({
        keyFile: SERVICE_ACCOUNT_FILE,
        scopes: ['https://www.googleapis.com/auth/indexing'],
      });
    }

    const authClient = await auth.getClient();
    console.log('Authentication successful!');

    // ── Diff URLs ─────────────────────────────────────────────────────────────
    const currentUrls = await getUrlsFromSitemap();
    const previouslyIndexed = await loadIndexedCache();
    const { toUpdate, toDelete } = diffUrls(currentUrls, previouslyIndexed);

    console.log(`\nSitemap has ${currentUrls.length} URLs total.`);
    console.log(`  New/changed URLs to submit: ${toUpdate.length}`);
    console.log(`  Removed URLs to notify:     ${toDelete.length}`);

    if (toUpdate.length === 0 && toDelete.length === 0) {
      console.log('\nNo changes detected — skipping API calls.');
      return;
    }

    // Respect daily quota
    const totalCalls = toUpdate.length + toDelete.length;
    if (totalCalls > DAILY_QUOTA_LIMIT) {
      console.warn(
        `\nWARNING: ${totalCalls} URLs to process exceeds the daily quota of ${DAILY_QUOTA_LIMIT}. Only the first ${DAILY_QUOTA_LIMIT} will be submitted.`,
      );
    }

    const indexing = google.indexing('v3');
    let requestCount = 0;
    let successCount = 0;
    let failCount = 0;

    // Track successfully indexed URLs for cache update
    const successfulUrls = new Set(previouslyIndexed);

    // ── Submit updated/new URLs ───────────────────────────────────────────────
    for (const url of toUpdate) {
      if (requestCount >= DAILY_QUOTA_LIMIT) {
        console.warn(`Daily quota limit (${DAILY_QUOTA_LIMIT}) reached. Stopping.`);
        break;
      }

      console.log(`  [UPDATE] ${url}`);
      const result = await publishWithRetry(indexing, authClient, url, 'URL_UPDATED');

      if (result.success) {
        console.log(`    ✓ Published (status: ${result.status})`);
        successfulUrls.add(url);
        successCount++;
      } else {
        console.error(`    ✗ Failed: ${result.error}`);
        failCount++;
      }

      requestCount++;
      if (requestCount < totalCalls) await sleep(DELAY_BETWEEN_REQUESTS_MS);
    }

    // ── Notify removed URLs ───────────────────────────────────────────────────
    for (const url of toDelete) {
      if (requestCount >= DAILY_QUOTA_LIMIT) {
        console.warn(`Daily quota limit (${DAILY_QUOTA_LIMIT}) reached. Stopping.`);
        break;
      }

      console.log(`  [DELETE] ${url}`);
      const result = await publishWithRetry(indexing, authClient, url, 'URL_DELETED');

      if (result.success) {
        console.log(`    ✓ Deletion notified (status: ${result.status})`);
        successfulUrls.delete(url);
        successCount++;
      } else {
        console.error(`    ✗ Failed: ${result.error}`);
        failCount++;
      }

      requestCount++;
      if (requestCount < totalCalls) await sleep(DELAY_BETWEEN_REQUESTS_MS);
    }

    // ── Save updated cache ────────────────────────────────────────────────────
    await saveIndexedCache(successfulUrls);

    console.log(`\nFinished! ${successCount} successful, ${failCount} failed out of ${requestCount} requests.`);
  } catch (err) {
    console.error('Error during indexing process:', err);
  }
}

runIndexing();
