export interface AppLink {
  label: string;
  url: string;
  /**
   * 'website' is the app's own branded domain and becomes its homepage.
   * 'app' is a bare deployment URL (a *.vercel.app), reachable, but not a
   * homepage, so the app's page here stays canonical.
   */
  type: 'website' | 'app' | 'chrome' | 'npm' | 'github';
}

/**
 * A narrow-screen screenshot of the app's own dashboard, shown inside a phone
 * frame on the landing page (see app/_components/ui/PhoneSnapshot.tsx).
 *
 * Only set this for apps that actually run on a phone, a PWA or a store app.
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
  /**
   * YouTube video id of the app's demo Short, played in a facade on its page
   * (see app/_components/ui/DemoVideo.tsx).
   *
   * The id, not a URL, because the same video is addressed three ways - the
   * /shorts/ link a human clicks, the /embed/ URL the iframe wants, and the
   * watch?v= form directory forms ask for - and storing one of those means
   * parsing it back out to build the other two.
   *
   * One per app, even where more than one Short exists: this page is the
   * fallback homepage, not a channel. The alternates live on the app's own
   * landing page, which rotates them.
   */
  demoVideo?: string;
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
    demoVideo: 'QMdrxa8XH1A',
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
    demoVideo: 'fNU_-C6JNoU',
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
    demoVideo: 'l4diwvUqcJY',
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
    // botornot.art does not serve. As of 2026-09-11 DNS does resolve (A
    // 196.53.155.51, Cloudflare NS) but HTTPS never connects, so the domain
    // is registered-but-dead rather than unregistered. Do not link it; the
    // Chrome Web Store listing below is the only verified-live destination.
    // Do NOT link bot-or-not.vercel.app either: that is a different party's
    // SvelteKit app, not ours.
    links: [
      {
        label: 'Chrome',
        url: 'https://chromewebstore.google.com/detail/bot-or-not/njohmblkingfikcgcbfcnjmciibhlmci',
        type: 'chrome',
      },
    ],
  },
  {
    // Live on the Chrome Web Store since September 2026, and the privacy page
    // for that listing has been served from /apps/bumboo/privacy since before
    // this entry existed, the app itself was simply never added here, so the
    // store listing's own homepage link had nowhere to point.
    id: 'bumboo',
    demoVideo: 'F2nX0rPA-1M',
    name: 'BumBoo',
    tagline: 'Used-Vehicle History Checks',
    description:
      'Reads the plate or VIN off a used-vehicle advert and shows the official record: MOT history, APK defects, safety recalls. Chrome extension.',
    icon: '/imgs/apps/bumboo.png',
    tags: ['Chrome Extension', 'Automotive', 'Tools'],
    links: [
      {
        label: 'Chrome',
        url: 'https://chromewebstore.google.com/detail/bumboo/npdmkhimldlbagpakbpojlgefaeogpbh',
        type: 'chrome',
      },
      { label: 'Privacy', url: '/apps/bumboo/privacy', type: 'website' },
    ],
  },
  {
    id: 'minutely',
    name: 'Minutely',
    tagline: 'AI Meeting Minutes',
    description:
      'Live transcript in a side panel, then AI minutes with action items and dates. Zoom, Teams and Meet, in the browser. Chrome extension.',
    icon: '/imgs/apps/minutely.png',
    tags: ['Chrome Extension', 'AI', 'Communication'],
    links: [{ label: 'Privacy', url: '/apps/minutely/privacy', type: 'website' }],
  },
  {
    id: 'screenful',
    name: 'Screenful',
    tagline: 'Full-Page Screenshots',
    description:
      'The whole scrollable page in one keystroke. No account, no watermark, no upload. Chrome extension.',
    icon: '/imgs/apps/screenful.png',
    tags: ['Chrome Extension', 'Screenshots', 'Privacy'],
    links: [
      {
        label: 'Chrome',
        url: 'https://chromewebstore.google.com/detail/screenful/obojmldajhdcklkgkedajkmdipnncpoe',
        type: 'chrome',
      },
      { label: 'Privacy', url: '/apps/screenful/privacy', type: 'website' },
    ],
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
    // Live on the Chrome Web Store since 2025. The AI reading of dates landed
    // in 1.1.0; until that version clears store review the listing still
    // serves the deterministic 1.0.0, so the description below describes what
    // is actually installable rather than what the repo now does.
    id: 'calendify',
    demoVideo: 'DnWywDT0na8',
    name: 'Calendify',
    tagline: 'Pages Into Calendar Events',
    description:
      'Highlight an event on any page and get a prefilled Google Calendar entry: date, time, venue and joining link. Chrome extension.',
    icon: '/imgs/apps/calendify.png',
    tags: ['Chrome Extension', 'Tools'],
    links: [
      {
        label: 'Chrome',
        url: 'https://chromewebstore.google.com/detail/calendify/jphgemnlnggiimgclghleogeiigpchji',
        type: 'chrome',
      },
      { label: 'GitHub', url: 'https://github.com/muammar-yacoob/Calendify', type: 'github' },
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
    id: 'spark-ads',
    name: 'SparkAds',
    tagline: 'Ads on Every Spark Dashboard',
    description:
      'An hour a day on every dashboard in the Spark network. One advertiser per hourly slot.',
    icon: '/imgs/apps/spark-ads.png',
    tags: ['Marketing', 'Ads', 'SaaS'],
    links: [{ label: 'Website', url: 'https://sparkads.dev', type: 'website' }],
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
    demoVideo: 'JIDeXKxWriI',
    name: 'Pitch Please',
    tagline: 'Dark Mode, Everywhere',
    description:
      'One click and any page goes pitch black. Dark mode for every website, with attitude.',
    icon: '/imgs/apps/pitchplease.png',
    tags: ['Chrome Extension', 'Dark Mode', 'Tools'],
    links: [
      // getpitchplease.com is dead (NXDOMAIN). pitchplease-ten.vercel.app is still
      // up, but a bare deployment URL is not a homepage and is not where installs
      // come from, so the Chrome Web Store listing is the link we advertise.
      {
        label: 'Chrome',
        url: 'https://chromewebstore.google.com/detail/pitch-please/pclmenmpcljlioccngfepokpgbgcbgjb',
        type: 'chrome',
      },
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
    // No public link. npmjs.com/package/klean is a DIFFERENT author's package
    // (knowbee, "A simple cache remover", 2020) and pointing at it shipped our
    // visitors to unrelated software. Our own repo (muammar-yacoob/Cleaner) is
    // private, so it 404s for anonymous visitors and cannot be linked either.
    // With no link at all, hasPublicDestination() keeps it off the grid.
    links: [],
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
    // Not store-listed yet and its old preview deployment is dead (404),
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
    demoVideo: 'SLtQN71xNh8',
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
    // No public listing yet, and the repo is private, no link means the
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
 * here) don't count, this answers "does it live somewhere else?".
 */
export function externalHomepage(app: SparkApp): AppLink | undefined {
  return app.links.find((l) => l.type === 'website' && /^https?:\/\//.test(l.url));
}

/** Which link to lead with, in the order a visitor would want it. */
const PRIMARY_ORDER: AppLink['type'][] = ['website', 'app', 'chrome', 'npm', 'github'];

/**
 * The one destination this app most wants a visitor to reach.
 *
 * There are no per-app pages on this site any more, so this is the real
 * answer rather than a stop on the way to one: an app's own domain, else
 * wherever it is installed from. A relative link (an on-site privacy policy)
 * is the last resort, because it is a footnote rather than a destination, and
 * an app with nothing at all returns undefined. hasPublicDestination() keeps
 * those off the landing page.
 */
export function primaryLink(app: SparkApp): AppLink | undefined {
  const external = app.links.filter((l) => /^https?:\/\//.test(l.url));
  for (const type of PRIMARY_ORDER) {
    const hit = external.find((l) => l.type === type);
    if (hit) return hit;
  }
  return external[0] ?? app.links[0];
}

/** Where an app lives, or '' when it lives nowhere we can link to. */
export function appHomepage(app: SparkApp): string {
  return primaryLink(app)?.url ?? '';
}

/**
 * Is there a link here we are happy to publish? Its own domain, a store
 * listing, an npm package, a public repo or a page on this site (a privacy
 * policy) all count.
 *
 * A bare *.vercel.app and an app with no links at all do not: the landing
 * page's grid hides those rather than advertising a card that leads nowhere.
 * The entry stays in this list, so llms.txt, the MCP catalogue and the privacy
 * pages linked from live store listings are all untouched.
 */
export function hasPublicDestination(app: SparkApp): boolean {
  return app.links.some((l) => !/\.vercel\.app/.test(l.url));
}

/**
 * Open source means the source is actually readable: a public git repo, and
 * nothing else. An npm package is a distribution channel, not a licence - the
 * published tarball of a closed-source tool sits on npm exactly like an open
 * one, so `type: 'npm'` says nothing about whether the repo is open.
 */
export function isOpenSource(app: SparkApp): boolean {
  return app.links.some((l) => l.type === 'github');
}

/**
 * Groups with the extensions on the landing page.
 *
 * Keyed on the tag, not on a `chrome` link: an extension is an extension from
 * the moment it ships, and Minutely is listed here before its store URL is.
 */
export function isChromeExtension(app: SparkApp): boolean {
  return app.tags.includes('Chrome Extension');
}

export function getApp(id: string): SparkApp | undefined {
  return sparkApps.find((app) => app.id === id);
}
