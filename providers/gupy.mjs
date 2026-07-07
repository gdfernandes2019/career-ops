// @ts-check
/** @typedef {import('./_types.js').Provider} Provider */

// Gupy provider — Brazil's largest ATS, board-wide aggregator feed.
// (https://employability-portal.gupy.io/api/v1/jobs). The public portal search
// API returns { data: [...], pagination: { total, limit, offset } } for a given
// jobName term across every company career page hosted on Gupy. Most Brazilian
// CLT/PJ Salesforce roles live here, so a broad term ("salesforce") plus
// scan.mjs's own title_filter/location_filter is the right split of labor.
//
// Wire in via a `job_boards:` entry with `provider: gupy`. Configure the search
// term(s) with `queries: [ ... ]` (defaults to ["salesforce"]). The list payload
// ships description + publishedDate for free, so both are passed through with no
// extra request (the scanner stays zero-token).

const API_HOST = 'https://employability-portal.gupy.io';
const PAGE_LIMIT = 100; // API max per page
const MAX_PAGES = 5; // safety cap: up to 500 postings per query term

/**
 * Builds a human-readable location string from a Gupy record.
 * Country is "Brasil" for portal results, so the location_filter's Brazil
 * always_allow surfaces every row; remote roles are prefixed for clarity.
 * @param {any} rec
 * @returns {string}
 */
function buildLocation(rec) {
  const parts = [rec.city, rec.state, rec.country].filter(
    (p) => typeof p === 'string' && p.trim() !== '',
  );
  let loc = parts.join(', ');
  const remote = rec.isRemoteWork === true || rec.workplaceType === 'remote';
  if (remote) loc = loc ? `Remote - ${loc}` : 'Remote - Brasil';
  return loc;
}

/** @type {Provider} */
export default {
  id: 'gupy',

  /**
   * Fetches and normalizes postings from the Gupy public portal search API.
   * @param {{ name?: string, queries?: string[] }} entry - The job_boards entry being processed.
   * @param {{ fetchJson: (url: string, opts?: { redirect?: 'error'|'follow'|'manual' }) => Promise<any> }} ctx - HTTP context.
   * @returns {Promise<Array<{title: string, url: string, company: string, location: string, description?: string, postedAt?: number}>>}
   */
  async fetch(entry, ctx) {
    const queries =
      Array.isArray(entry.queries) && entry.queries.length > 0
        ? entry.queries.filter((q) => typeof q === 'string' && q.trim() !== '')
        : ['salesforce'];

    /** @type {Map<string, any>} */
    const byUrl = new Map();

    for (const term of queries) {
      for (let page = 0; page < MAX_PAGES; page++) {
        const offset = page * PAGE_LIMIT;
        const url =
          `${API_HOST}/api/v1/jobs?jobName=${encodeURIComponent(term)}` +
          `&limit=${PAGE_LIMIT}&offset=${offset}`;
        // redirect:'error' prevents SSRF via server-side redirects
        const json = await ctx.fetchJson(url, { redirect: 'error' });
        if (!json || !Array.isArray(json.data)) {
          throw new Error(
            `gupy: unexpected API response — expected { data: [...] }, got keys: [${json ? Object.keys(json).join(', ') : 'null'}]`,
          );
        }

        for (const rec of json.data) {
          if (!rec || typeof rec !== 'object') continue;
          const title = typeof rec.name === 'string' ? rec.name.trim() : '';
          const jobUrl = typeof rec.jobUrl === 'string' ? rec.jobUrl.trim() : '';
          if (!title || !/^https?:\/\//i.test(jobUrl)) continue;
          if (byUrl.has(jobUrl)) continue; // dedup across query terms

          const job = {
            title,
            url: jobUrl,
            company:
              typeof rec.careerPageName === 'string' && rec.careerPageName.trim()
                ? rec.careerPageName.trim()
                : entry.name || 'Gupy',
            location: buildLocation(rec),
          };
          if (typeof rec.description === 'string' && rec.description.trim()) {
            job.description = rec.description.trim();
          }
          const ts = Date.parse(rec.publishedDate);
          if (!Number.isNaN(ts)) job.postedAt = ts;

          byUrl.set(jobUrl, job);
        }

        // Stop paging once we've consumed the reported total or hit a short page.
        const total = json.pagination && Number(json.pagination.total);
        if (json.data.length < PAGE_LIMIT) break;
        if (Number.isFinite(total) && offset + PAGE_LIMIT >= total) break;
      }
    }

    return [...byUrl.values()];
  },
};
