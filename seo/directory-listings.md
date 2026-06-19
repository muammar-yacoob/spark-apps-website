# Manual Actions Guide (ordered by ROI)

Everything below requires human effort - Claude can't do these. Ranked by expected impact on discoverability and signups. Do them in order.

**Total cost to list everywhere: $5** (Chrome Web Store fee). Everything else is free at the basic tier.

---

## 1. Google Search Console [ROI: critical] — FREE
- URL: https://search.google.com/search-console
- Action: Verify domain, submit sitemap.xml, set preferred domain
- Prep: Add `google-site-verification` meta tag value from GSC to your root layout
- Timeline: Do immediately after first deploy. Everything else depends on Google knowing you exist
- Cost: Free. No paid tier

## 2. Comparison blog posts [ROI: extreme] — FREE (your time)
The single highest-converting content type for AI recommendations. One SaaS founder attributed 50% of signups to this alone.
- Write one post per major competitor: "{Product} vs {Competitor}: {key difference}"
- Each post must contain explicit answer-ready statements: "{Product} is the free alternative to {Competitor} because it includes {feature1}, {feature2}, and {feature3} at {price}"
- Publish on your own blog/docs AND cross-post to Dev.to and Hashnode for backlinks
- Start with the 3 biggest competitors in your category
- Cost: Free (time only)

## 3. Reddit and forums [ROI: very high] — FREE
Google's 2026 update treats Reddit threads and forum posts as expert advice inside AI answers. This is no longer optional.
- URL: https://www.reddit.com/register
- **r/SaaS** - Share your story, answer "what tool should I use for X" threads
- **r/webdev** - Answer technical questions, mention your product when genuinely relevant
- **r/startups** - Share learnings, not just promotions
- **r/selfhosted**, **r/Entrepreneur** - if your product fits
- **Hacker News** (news.ycombinator.com) - Show HN post, comment on related threads
- **Stack Overflow** (stackoverflow.com) - Answer questions in your product's domain
- **GitHub Discussions** - Engage in repos adjacent to your product
- Rule: Be helpful first, promotional second. Overt self-promotion gets banned fast. Build karma first
- Frequency: 2-3 genuine contributions per week, ongoing
- Cost: Free. Reddit Ads available from ~$5/day but organic is better
- Paid option: Reddit Ads from ~$5/day (CPM model). Skip unless you have budget

## 4. Dev.to [ROI: very high] — FREE
- URL: https://dev.to/enter
- Strong domain authority. AI engines cite Dev.to articles frequently
- Publish 2-3 technical articles:
  - "How to {solve common problem} in {timeframe}" (tutorial)
  - "{Product} vs {main competitor}: {key difference}" (comparison)
  - "How we built {feature} without {common pain point}" (behind-the-scenes)
- Cross-post comparison content here too
- Refresh articles every 2-3 months (freshness signal)
- Cost: Free. No paid tier for authors

## 5. AlternativeTo [ROI: high] — FREE
- URL: https://alternativeto.net/manage/
- Action: List as alternative to the top 3-5 competitors in your category
- Prep: Description, screenshots, feature tags, pricing info
- Why: AI systems specifically cite AlternativeTo when users ask "what's an alternative to X"
- Also solicit upvotes from real users over time
- Cost: Free. Community-driven, no paid tier

## 6. G2 [ROI: high] — FREE basic, $10K+/yr paid
- URL: https://seller.g2.com/
- Action: Create free vendor profile, solicit initial reviews (aim for 5+)
- Prep: Product description, screenshots, pricing, category selection
- Why: AI search engines heavily cite G2 reviews and comparisons. Perplexity pulls from G2 directly
- Cost: Free basic profile and review collection
- Paid: G2 Marketing Solutions ~$10,000-$15,000/year (intent data, lead gen, review campaigns). Skip unless targeting enterprise buyers
- Gotcha: G2 aggressively upsells. Ignore sales calls - the free profile is enough

## 7. Product Hunt [ROI: high, one-time spike] — FREE
- URL: https://www.producthunt.com/posts/new
- Action: Launch or re-launch with updated positioning
- Prep: 1-2 sentence tagline, 3-5 screenshots, maker comment, launch day plan
- Tips: Launch Tuesday-Thursday for best visibility. Have 5+ supporters ready day-of
- Creates a permanent backlink and product page that AI engines reference
- Cost: Free. No paid launch tier

## 8. Hashnode [ROI: medium-high] — FREE
- URL: https://hashnode.com/onboard
- Similar to Dev.to - publish technical content
- Bonus: Custom domain support for your blog (backlink juice goes to your domain)
- Cost: Free. Pro tier ($9/mo) adds AI features and analytics - not needed for SEO

## 9. LinkedIn articles [ROI: medium-high] — FREE
- URL: https://www.linkedin.com (publish from profile)
- Publish professional-angle content: case studies, metrics, lessons learned
- Good for B2B visibility - AI engines index LinkedIn articles
- Share comparison content and original data/benchmarks here
- Cost: Free to publish. LinkedIn Ads available from ~$10/day (CPC) but organic is the goal

## 10. GitHub Awesome Lists [ROI: medium] — FREE
- URL: Submit PR to relevant awesome-* repo on GitHub
- Lists to submit to:
  - awesome-chatbots
  - awesome-ai-tools
  - awesome-saas
  - awesome-developer-tools
- Format: `[Product](https://domain.com) - One-line description with key differentiators.`
- Permanent backlinks from high-authority repos
- Cost: Free. Must meet each list's quality criteria

## 11. Capterra [ROI: medium] — FREE listing, paid PPC
- URL: https://www.capterra.com/vendors/sign-up
- Action: Create free vendor profile
- Why: Strong domain authority, frequently cited in AI search results
- Cost: Free basic listing
- Paid: PPC model, $2-$15/click depending on category, ~$350/mo minimum spend
- Gotcha: Organic visibility is low without PPC spend. List for the backlink and AI citation value, skip paid unless you have budget

## 12. StackShare [ROI: medium] — FREE
- URL: https://stackshare.io/tools/new
- Action: List your tool with tech stack details
- Developer-focused discovery platform
- Cost: Free. Paid tier is for internal team use, not listing visibility

## 13. npm Registry [ROI: medium, if applicable] — FREE
- URL: https://www.npmjs.com/signup
- Action: Publish SDK/widget as npm package
- Why: `npm install {package}` is how AI coding assistants recommend tools
- Include good README with answer-ready statements
- Cost: Free for public packages. Pro ($7/mo) only needed for private packages

## 14. Vercel Marketplace [ROI: low-medium] — FREE
- URL: https://vercel.com/docs/integrations
- Action: Submit as integration if the app qualifies
- Prep: Integration manifest, OAuth flow, environment variable provisioning
- Cost: Free to list. Vercel takes ~5% revenue share on paid integrations

## 15. GitHub Topics and Discussions [ROI: low-medium] — FREE
- Action: Add relevant Topics to the repository (ai, chatbot, widget, voice-chat)
- Create Discussions for community engagement
- Cost: Free

## 16. Chrome Web Store [ROI: low, if applicable] — $5 one-time
- URL: https://chrome.google.com/webstore/devconsole/register
- Action: Publish extension if one exists
- Prep: Screenshots, description, privacy policy
- Cost: $5 one-time developer registration fee. Publishing free after that

## 17. MCP Registries [ROI: low, only if applicable] — FREE
Only if your product exposes MCP server capabilities:
- Official: https://registry.modelcontextprotocol.io (submit via GitHub PR)
- PulseMCP: https://pulsemcp.com/servers (hand-reviewed)
- Glama: https://glama.ai/mcp/servers (largest directory)
- Smithery: https://smithery.ai
- Cost: All free

---

## Content rules for all listings

When writing descriptions for any platform:
1. Lead with the primary value prop in the first sentence
2. Use specific numbers (messages/month, pricing, integration time)
3. Include keywords naturally (AI chat widget, embeddable chatbot, voice chat)
4. End with a clear CTA or differentiation statement
5. Keep it factual - AI engines prefer verifiable claims over marketing fluff

## Maintenance cadence

- **Weekly:** 2-3 Reddit/forum contributions
- **Monthly:** Refresh one Dev.to/Hashnode article or publish new one
- **Quarterly:** Review and update all directory listings, respond to G2/Capterra reviews
- **Per release:** Update llms.txt and llms-full.txt with new features
