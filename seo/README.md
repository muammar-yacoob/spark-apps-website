# SEO & AI Discoverability Kit

Reusable prompts, checklists, and templates for maximizing search engine visibility, AI discoverability, and marketability for any web app.

## Structure

```
seo/
  audit.txt                  # Main Claude prompt - run this on any project
  per-page-checklist.md      # What every HTML page needs (meta, OG, Twitter, etc.)
  directory-listings.md      # Manual submission guide (Product Hunt, G2, etc.)
  post-deploy-checklist.md   # Validation steps after shipping SEO changes
  templates/
    llms.txt                 # Skeleton for AI agent discovery file
    llms-full.txt            # Skeleton for comprehensive AI reference
    robots.txt               # Template with AI crawler management
    security.txt             # RFC 9116 trust signal template
    opensearch.xml           # Browser search integration template
    json-ld-homepage.json    # Structured data template (SoftwareApplication, Organization, WebSite, WebPage)
```

## Usage

### Full audit on a new project

Feed `audit.txt` to a Claude session pointed at the project repo. It will:
1. Inventory and rank features by market value
2. Audit all SEO artifacts against a comprehensive checklist
3. Apply fixes directly to the codebase
4. Output manual action items (directory listings, third-party content)

### Quick per-page check

Use `per-page-checklist.md` after adding a new page to verify nothing is missing.

### Bootstrapping a new project

Copy files from `templates/` into your project's `public/` directory, replace `{placeholders}`, and customize.

### After deploying

Run through `post-deploy-checklist.md` to validate everything works in production.

### Growing visibility

Follow `directory-listings.md` for manual submissions, prioritized by impact tier.
