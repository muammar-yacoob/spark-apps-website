# Post-Deploy Validation Checklist

Run through this after deploying SEO changes to production.

## Automated Checks

### Structured Data
- [ ] Google Rich Results Test: https://search.google.com/test/rich-results
  - Enter production URL
  - Verify all JSON-LD types are detected without errors
  - Check which rich result types are eligible
- [ ] Schema Markup Validator: https://validator.schema.org
  - Paste JSON-LD from page source
  - Fix any warnings or errors

### Performance
- [ ] Lighthouse audit (Chrome DevTools > Lighthouse)
  - LCP < 2.0s (threshold tightened March 2026)
  - CLS < 0.1
  - INP < 200ms
  - SEO score > 95
- [ ] PageSpeed Insights: https://pagespeed.web.dev
  - Test both mobile and desktop
  - Address any red/orange metrics

### Crawlability
- [ ] robots.txt tester in Google Search Console
- [ ] Fetch as Google for homepage and key pages
- [ ] Verify sitemap.xml is accessible at production URL
- [ ] Verify sitemap lastmod dates are accurate

## Manual Checks

### Files accessible at production URL
- [ ] `https://{domain}/sitemap.xml`
- [ ] `https://{domain}/robots.txt`
- [ ] `https://{domain}/llms.txt`
- [ ] `https://{domain}/llms-full.txt`
- [ ] `https://{domain}/.well-known/security.txt`
- [ ] `https://{domain}/opensearch.xml`
- [ ] `https://{domain}/manifest.json`

### OpenSearch
- [ ] In Chrome/Edge: type your domain in address bar, press Tab
- [ ] Should show "Search {Brand}" prompt
- [ ] If not working: verify `<link rel="search">` is in `<head>` and opensearch.xml is valid

### Social Preview
- [ ] Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
  - Test homepage and 2-3 key pages
  - Verify image, title, description render correctly
- [ ] Twitter Card Validator: https://cards-dev.twitter.com/validator
  - Test same pages
- [ ] LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

### AI Discoverability
- [ ] Visit /llms.txt and /llms-full.txt in browser - verify Content-Type is text/plain
- [ ] Read through llms-full.txt - would an AI agent have enough info to recommend AND integrate your product?
- [ ] Check robots.txt - are AI retrieval crawlers explicitly allowed?

### Per-Page Consistency
Spot-check 3-4 pages against per-page-checklist.md:
- [ ] Unique title and description
- [ ] Canonical URL matches actual URL
- [ ] OG tags complete (type, url, title, description, image, image dimensions, site_name)
- [ ] Twitter card complete (card, title, description, image)
- [ ] OpenSearch link present
- [ ] Footer links consistent across pages
- [ ] H1 present and matches search intent

## Google Search Console Setup

If not already configured:
1. [ ] Go to https://search.google.com/search-console
2. [ ] Add property (URL prefix method recommended)
3. [ ] Verify ownership (HTML meta tag method is easiest)
4. [ ] Add verification code to root layout or homepage `<head>`:
   `<meta name="google-site-verification" content="{code}">`
5. [ ] Submit sitemap: Sitemaps > Add > `/sitemap.xml`
6. [ ] Request indexing for homepage

## Monitoring (ongoing)

- [ ] Check Search Console weekly for indexing issues
- [ ] Monitor Core Web Vitals in Search Console
- [ ] Update dateModified in JSON-LD when content changes
- [ ] Refresh llms.txt and llms-full.txt with feature releases
- [ ] Renew security.txt before expiry date (set calendar reminder)
