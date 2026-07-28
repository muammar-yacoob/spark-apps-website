export interface AppLink {
  label: string;
  url: string;
  type: 'website' | 'chrome' | 'npm' | 'github';
}

export interface SparkApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  tags: string[];
  links: AppLink[];
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
    links: [
      // botornot.art is dead (NXDOMAIN); use the live Vercel production URL.
      { label: 'Website', url: 'https://bot-or-not-spark-apps.vercel.app', type: 'website' },
      {
        label: 'Chrome',
        url: 'https://chromewebstore.google.com/detail/bot-or-not/njohmblkingfikcgcbfcnjmciibhlmci',
        type: 'chrome',
      },
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
      // getpitchplease.com is dead (NXDOMAIN); use the live Vercel production URL.
      { label: 'Website', url: 'https://pitchplease-ten.vercel.app', type: 'website' },
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
    links: [{ label: 'Website', url: 'https://flexcel-five.vercel.app', type: 'website' }],
  },
  {
    id: 'fullhouse',
    name: 'FullHouse',
    tagline: 'Timing is Everything',
    description: 'Know when the quietest time to be in a place is.',
    icon: '/imgs/apps/fullhouse.png',
    tags: ['Mobile', 'Places', 'AI'],
    links: [{ label: 'Website', url: 'https://spark-fullhouse.vercel.app', type: 'website' }],
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
];
