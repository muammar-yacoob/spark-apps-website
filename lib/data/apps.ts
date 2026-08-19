export interface AppLink {
  label: string;
  url: string;
  /**
   * 'website' is the app's own branded domain and becomes its homepage.
   * 'app' is a bare deployment URL (a *.vercel.app) — reachable, but not a
   * homepage, so the app's page here stays canonical.
   */
  type: 'website' | 'app' | 'chrome' | 'npm' | 'github';
}

/**
 * A narrow-screen screenshot of the app's own dashboard, shown inside a phone
 * frame on the landing page (see app/_components/ui/PhoneSnapshot.tsx).
 *
 * Only set this for apps that actually run on a phone — a PWA or a store app.
 * Capture at 2x the frame size (536x1080), crop off the browser chrome and the
 * device status bar, and drop the PNG at /public/imgs/app-shots/<id>.png.
 */
export interface AppMobileShot {
  screenshot: string;
  /** Describe what the screen shows; this is content, not decoration. */
  alt: string;
  /** Tints the bezel so the frame matches the app's brand. */
  accent?: string;
  caption?: string;
}

export interface SparkApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  tags: string[];
  links: AppLink[];
  /** Present only for apps with a phone UI worth showing. */
  mobile?: AppMobileShot;
}

export const sparkApps: SparkApp[] = [
  {
    id: 'sparkstack',
    name: 'SparkStack',
    tagline: 'SaaS Starter Kit',
    description: 'The full-stack starter that sparks your next project.',
    icon: '/imgs/apps/sparkstack.png',
    tags: ['Next.js', 'Full-Stack', 'Starter'],
    links: [{ label: 'Website', url: 'https://sparkstack.dev', type: 'website' }],
  },
  {
    id: 'sparkmobile',
    name: 'SparkMobile',
    tagline: 'Mobile App Starter',
    description:
      'Clean, versatile Expo starter with subscriptions, onboarding, and theming baked in.',
    icon: '/imgs/apps/sparkmobile.png',
    tags: ['Expo', 'React Native', 'Mobile'],
    links: [{ label: 'Website', url: 'https://sparkmobile.dev', type: 'website' }],
  },
  {
    id: 'sellular',
    name: 'Sellular',
    tagline: 'SaaS Visibility Platform',
    description: 'AI-powered SEO, directory listings, and discoverability tools for SaaS.',
    icon: '/imgs/apps/sellular.png',
    tags: ['SEO', 'AI', 'Marketing'],
    links: [{ label: 'Website', url: 'https://sellular.online', type: 'website' }],
  },
  {
    id: 'bottled',
    name: 'Bottled',
    tagline: 'Custom Domain Email',
    description: 'Send messages in bottles across the digital ocean. Pro email on your domain.',
    icon: '/imgs/apps/bottled.png',
    tags: ['Email', 'Domain', 'Communication'],
    links: [{ label: 'Website', url: 'https://bottled.email', type: 'website' }],
  },
  {
    id: 'vidlet',
    name: 'VidLet',
    tagline: 'Video Toolkit',
    description: 'Auto-captions, compression, voice cleanup, GIF conversion and more.',
    icon: '/imgs/apps/vidlet-web.png',
    tags: ['Video', 'Web', 'Desktop'],
    links: [
      { label: 'Website', url: 'https://vidlet.app', type: 'website' },
      { label: 'npm', url: 'https://www.npmjs.com/package/@spark-apps/vidlet', type: 'npm' },
    ],
  },
  {
    id: 'viralcat',
    name: 'ViralCat',
    tagline: 'Social Media Automation',
    description: 'AI content discovery and multi-platform publishing for social media.',
    icon: '/imgs/apps/viralcat.png',
    tags: ['Social Media', 'AI', 'Analytics'],
    links: [{ label: 'Website', url: 'https://viral-cat.com', type: 'website' }],
  },
  {
    id: 'quickpeek',
    name: 'QuickPeek',
    tagline: 'AI Demo Videos',
    description: 'Auto-generate demo videos for your web app with AI.',
    icon: '/imgs/apps/quickpeek.png',
    tags: ['AI', 'Video', 'Demo'],
    links: [
      { label: 'npm', url: 'https://www.npmjs.com/package/@spark-apps/quickpeek', type: 'npm' },
    ],
  },
  {
    id: 'botornot',
    name: 'BotOrNot',
    tagline: 'AI Content Detection',
    description: 'AI content detection. Chrome extension and PWA.',
    icon: '/imgs/apps/botornot.png',
    tags: ['AI', 'Chrome Extension', 'Detection'],
    // No public "Open app" link until botornot.art is reachable again.
    // The domain is registered and still aliased to the live production deployment,
    // but its DNS (Cloudflare NS) points at 188.127.241.99, a host unrelated to us.
    // Every other production alias is SSO-gated or redirects to that broken domain.
    // Do NOT link bot-or-not.vercel.app: that is a different party's SvelteKit app,
    // not ours -- our aliases are all *-spark-apps.vercel.app / bot-or-not-nine.
    links: [
      {
        label: 'Chrome',
        url: 'https://chromewebstore.google.com/detail/bot-or-not/njohmblkingfikcgcbfcnjmciibhlmci',
        type: 'chrome',
      },
    ],
  },
  {
    id: 'screenful',
    name: 'Screenful',
    tagline: 'Full-Page Screenshots',
    description:
      'The whole scrollable page in one keystroke. No account, no watermark, no upload. Chrome extension.',
    icon: '/imgs/apps/screenful.png',
    tags: ['Chrome Extension', 'Screenshots', 'Privacy'],
    // Not on the Chrome Web Store yet; the privacy page is the store-submission target.
    links: [{ label: 'Privacy', url: '/apps/screenful/privacy', type: 'website' }],
  },
  {
    id: 'textpert',
    name: 'TextPert',
    tagline: 'Autocorrect on Steroids',
    description: 'Polish your text or generate savage replies. Chrome extension.',
    icon: '/imgs/apps/textpert.png',
    tags: ['AI', 'Chrome Extension', 'Tools'],
    links: [
      {
        label: 'Chrome',
        url: 'https://chromewebstore.google.com/detail/ogfhfgojcfmgjnalejpbomllbkehmmch',
        type: 'chrome',
      },
    ],
  },
  {
    id: 'spark-ai',
    name: 'SparkAI',
    tagline: 'Embeddable AI Chat',
    description: 'AI chat widget with voice, live chat, and ticketing.',
    icon: '/imgs/apps/spark-ai.png',
    tags: ['AI', 'Chat', 'Widget'],
    links: [{ label: 'Website', url: 'https://sparkbrain.app', type: 'website' }],
  },
  {
    id: 'spark-stripe',
    name: 'SparkPay',
    tagline: 'Universal Payment Backend',
    description: 'Universal Stripe payment backend. Deploy once, add payments to any app.',
    icon: '/imgs/apps/spark-stripe.png',
    tags: ['Payments', 'Stripe', 'Backend'],
    links: [{ label: 'Website', url: 'https://sparkpay.dev', type: 'website' }],
  },
  {
    id: 'pitchplease',
    name: 'Pitch Please',
    tagline: 'Dark Mode, Everywhere',
    description:
      'One click and any page goes pitch black. Dark mode for every website, with attitude.',
    icon: '/imgs/apps/pitchplease.png',
    tags: ['Chrome Extension', 'Dark Mode', 'Tools'],
    links: [
      // getpitchplease.com is dead (NXDOMAIN); the live deployment is the Vercel URL.
      { label: 'Open app', url: 'https://pitchplease-ten.vercel.app', type: 'app' },
      { label: 'Privacy', url: '/apps/pitchplease/privacy', type: 'website' },
    ],
  },
  {
    id: 'klean',
    name: 'KLean',
    tagline: 'Project Cleanup CLI',
    description: 'CLI to analyze, clean, and refactor any project.',
    icon: '/imgs/apps/klean.png',
    tags: ['CLI', 'DevTools', 'Cleanup'],
    links: [{ label: 'npm', url: 'https://www.npmjs.com/package/klean', type: 'npm' }],
  },
  {
    id: 'still-applying',
    name: 'Still Applying',
    tagline: 'ATS Resume Builder',
    description:
      'AI-assisted resume builder with shareable links and a Chrome extension that autofills job applications.',
    icon: '/imgs/apps/still-applying.png',
    tags: ['AI', 'Resume', 'Job Search'],
    links: [{ label: 'Website', url: 'https://stillapplying.com', type: 'website' }],
  },
  {
    id: 'flexcel',
    name: 'Flexcel',
    tagline: 'AI Excel Add-in',
    description: 'Natural language chat, formula assistance, and data analysis inside Excel.',
    icon: '/imgs/apps/flexcel.png',
    tags: ['AI', 'Excel', 'Add-in'],
    links: [{ label: 'Open app', url: 'https://flexcel-five.vercel.app', type: 'app' }],
  },
  {
    id: 'fullhouse',
    name: 'FullHouse',
    tagline: 'Timing is Everything',
    description: 'Know when the quietest time to be in a place is.',
    icon: '/imgs/apps/fullhouse.png',
    tags: ['Mobile', 'Places', 'AI'],
    // Not store-listed yet and its old preview deployment is dead (404) —
    // no link means the tooltip reads "Coming soon" instead of a dead one.
    links: [],
    mobile: {
      screenshot: '/imgs/app-shots/fullhouse.png',
      alt: 'FullHouse showing how busy a place is through the day',
      accent: '#f59e0b',
      caption: 'Busiest hours, at a glance',
    },
  },
  {
    id: 'piclet',
    name: 'PicLet',
    tagline: 'Image Tools Toolkit',
    description:
      'Right-click image tools for content creators. Crop, remove backgrounds, and more. CLI, GUI, and web.',
    icon: '/imgs/apps/piclet.png',
    tags: ['Image', 'CLI', 'Web'],
    links: [
      { label: 'Website', url: 'https://piclet.app', type: 'website' },
      { label: 'npm', url: 'https://www.npmjs.com/package/@spark-apps/piclet', type: 'npm' },
    ],
  },
  {
    id: 'ducktax',
    name: 'Duck Tax',
    tagline: 'Micro-Entity Accounts',
    description:
      'Statutory accounts engine for micro-entities. Raw figures in, validated balance sheet out.',
    icon: '/imgs/apps/ducktax.png',
    tags: ['Accounting', 'SaaS', 'Finance'],
    links: [{ label: 'Website', url: 'https://ducktax.com', type: 'website' }],
  },
  {
    id: 'safesound',
    name: 'Safe & Sound',
    tagline: 'Personal Safety App',
    description: 'Personal safety companion for iOS and Android, built with Expo.',
    icon: '/imgs/apps/safesound.png',
    tags: ['Mobile', 'Expo', 'Safety'],
    // No public listing yet, and the repo is private — no link means the
    // tooltip reads "Coming soon" instead of a 404 GitHub page.
    links: [],
    mobile: {
      screenshot: '/imgs/app-shots/safesound.png',
      alt: 'Safe & Sound showing active check-ins and trusted contacts',
      accent: '#10b981',
      caption: 'Check in, or someone gets told',
    },
  },
  {
    id: 'chat-faker',
    name: 'Chat Faker',
    tagline: 'Fake WhatsApp Chats',
    description: 'Build pixel-perfect fake WhatsApp chats and export them as images.',
    icon: '/imgs/apps/chat-faker.png',
    tags: ['Chat', 'Tools'],
    // chatfaker.app is unregistered (NXDOMAIN); the live deployment is the Vercel URL.
    links: [{ label: 'Open app', url: 'https://chat-faker.vercel.app', type: 'app' }],
  },
  {
    id: 'clipboard-image-terminal',
    name: 'Clipboard Image to Terminal',
    tagline: 'Paste Images into Terminal',
    description:
      'Paste clipboard images as file paths into the VS Code terminal. Built for AI coding tools on WSL.',
    icon: '/imgs/apps/clipboard-image-terminal.png',
    tags: ['DevTools', 'Tools'],
    links: [
      {
        label: 'npm',
        url: 'https://www.npmjs.com/package/clipboard-image-terminal',
        type: 'npm',
      },
      {
        label: 'GitHub',
        url: 'https://github.com/muammar-yacoob/clipboard-image-terminal',
        type: 'github',
      },
    ],
  },
  {
    id: 'gmail-manager-mcp',
    name: 'Gmail Manager MCP',
    tagline: 'Inbox & Calendar via MCP',
    description:
      'An MCP server for Gmail and Google Calendar: manage, organise and clean up your inbox, and run your calendar, from one server.',
    icon: '/imgs/apps/gmail-manager-mcp.png',
    tags: ['Email', 'Tools', 'Backend'],
    links: [
      {
        label: 'npm',
        url: 'https://www.npmjs.com/package/@spark-apps/gmail-manager-mcp',
        type: 'npm',
      },
      {
        label: 'GitHub',
        url: 'https://github.com/muammar-yacoob/GMail-Manager-MCP',
        type: 'github',
      },
    ],
  },
];

/**
 * The app's own site, if it has one. Relative links (a privacy page hosted
 * here) don't count — this answers "does it live somewhere else?".
 */
export function externalHomepage(app: SparkApp): AppLink | undefined {
  return app.links.find((l) => l.type === 'website' && /^https?:\/\//.test(l.url));
}

/**
 * Where an app lives: its own site if it has one, else its page on this site.
 *
 * Several apps ship without a domain (a CLI on npm, an extension awaiting the
 * store). `/apps/<id>` is their homepage — real enough for a store listing, a
 * README badge, or a sitemap entry — and stays a valid fallback after a domain
 * shows up.
 */
export function appHomepage(app: SparkApp): string {
  return externalHomepage(app)?.url ?? `/apps/${app.id}`;
}

export function getApp(id: string): SparkApp | undefined {
  return sparkApps.find((app) => app.id === id);
}
