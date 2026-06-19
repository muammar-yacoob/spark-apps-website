# Per-Page SEO Checklist

Every public HTML page must have ALL of the following. Use this as a consistency audit across pages.

## Required in `<head>`

### Core meta
- [ ] `<meta charset="UTF-8">`
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [ ] `<meta name="description" content="...">` (unique per page, <155 chars, includes CTA)
- [ ] `<title>Page Name - BrandName</title>` (unique per page, <60 chars, front-load keywords)
- [ ] `<link rel="canonical" href="https://domain.com/page">`
- [ ] `<link rel="icon" type="image/png" href="/favicon.png">`

### OpenGraph (required for social sharing, LinkedIn, Slack, Discord)
- [ ] `<meta property="og:type" content="website">` (or "article" for docs/blog)
- [ ] `<meta property="og:url" content="https://domain.com/page">`
- [ ] `<meta property="og:title" content="Page Name - BrandName">`
- [ ] `<meta property="og:description" content="...">`
- [ ] `<meta property="og:image" content="https://domain.com/api/og">`
- [ ] `<meta property="og:image:width" content="1200">`
- [ ] `<meta property="og:image:height" content="630">`
- [ ] `<meta property="og:site_name" content="BrandName">`

### Twitter Card
- [ ] `<meta name="twitter:card" content="summary_large_image">`
- [ ] `<meta name="twitter:title" content="Page Name - BrandName">`
- [ ] `<meta name="twitter:description" content="...">`
- [ ] `<meta name="twitter:image" content="https://domain.com/api/og">`

### Discovery links
- [ ] `<link rel="manifest" href="/manifest.json">` (homepage only, or all pages)
- [ ] `<link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="BrandName">`
- [ ] `<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly version">`

### PWA / Mobile (homepage at minimum, ideally all pages)
- [ ] `<meta name="theme-color" content="#...">`
- [ ] `<meta name="apple-mobile-web-app-capable" content="yes">`
- [ ] `<meta name="apple-mobile-web-app-title" content="BrandName">`
- [ ] `<link rel="apple-touch-icon" href="/favicon.png">`

## Required in `<body>`

- [ ] Exactly one `<h1>` tag matching the page's search intent
- [ ] All `<img>` tags have descriptive `alt` text (empty `alt=""` only for purely decorative images)
- [ ] Internal links to related pages in footer or sidebar

## Footer consistency

Every page footer must include this base set of links:
- [ ] Docs
- [ ] Pricing
- [ ] Support
- [ ] Terms
- [ ] Privacy

Pages may add contextual links (e.g., Discord on support page, SDKs on SDK page) but the base set must always be present. Do NOT remove existing page-specific links when standardizing - only add missing base links.

## Pages to exclude from indexing

These should have `<meta name="robots" content="noindex, nofollow">`:
- Error pages (404, 500)
- Dashboard / authenticated pages
- Callback / redirect pages
