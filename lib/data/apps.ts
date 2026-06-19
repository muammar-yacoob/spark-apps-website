export interface SparkApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  tags: string[];
  links?: { label: string; url: string }[];
}

export const sparkApps: SparkApp[] = [
  {
    id: 'sparkstack',
    name: 'SparkStack',
    tagline: 'SaaS Starter Kit',
    description: 'The full-stack starter that sparks your next project.',
    icon: '/imgs/apps/sparkstack.png',
    tags: ['Next.js', 'Full-Stack', 'Starter'],
  },
  {
    id: 'sellular',
    name: 'Sellular',
    tagline: 'SaaS Visibility Platform',
    description: 'AI-powered SEO, directory listings, and discoverability tools for SaaS.',
    icon: '/imgs/apps/sellular.png',
    tags: ['SEO', 'AI', 'Marketing'],
  },
  {
    id: 'bottled',
    name: 'Bottled',
    tagline: 'Custom Domain Email',
    description: 'Send messages in bottles across the digital ocean. Pro email on your domain.',
    icon: '/imgs/apps/bottled.png',
    tags: ['Email', 'Domain', 'Communication'],
  },
  {
    id: 'vidlet',
    name: 'VidLet',
    tagline: 'Video Toolkit',
    description: 'Auto-captions, compression, voice cleanup, GIF conversion and more.',
    icon: '/imgs/apps/vidlet-web.png',
    tags: ['Video', 'Web', 'Desktop'],
    links: [
      { label: 'Web', url: 'https://vidlet.co' },
      { label: 'npm', url: 'https://www.npmjs.com/package/@spark-apps/vidlet' },
    ],
  },
  {
    id: 'viralcat',
    name: 'ViralCat',
    tagline: 'Social Media Automation',
    description: 'AI content discovery and multi-platform publishing for social media.',
    icon: '/imgs/apps/viralcat.png',
    tags: ['Social Media', 'AI', 'Analytics'],
  },
  {
    id: 'quickpeek',
    name: 'QuickPeek',
    tagline: 'AI Demo Videos',
    description: 'Auto-generate demo videos for your web app with AI.',
    icon: '/imgs/apps/quickpeek.png',
    tags: ['AI', 'Video', 'Demo'],
  },
  {
    id: 'botornot',
    name: 'BotOrNot',
    tagline: 'AI Content Detection',
    description: 'AI content detection. Chrome extension and PWA.',
    icon: '/imgs/apps/botornot.png',
    tags: ['AI', 'Chrome Extension', 'Detection'],
  },
  {
    id: 'textpert',
    name: 'TextPert',
    tagline: 'Autocorrect on Steroids',
    description: 'Polish your text or generate savage replies. Chrome extension.',
    icon: '/imgs/apps/textpert.png',
    tags: ['AI', 'Chrome Extension', 'Tools'],
  },
  {
    id: 'spark-ai',
    name: 'SparkAI',
    tagline: 'Embeddable AI Chat',
    description: 'AI chat widget with voice, live chat, and ticketing.',
    icon: '/imgs/apps/spark-ai.png',
    tags: ['AI', 'Chat', 'Widget'],
  },
  {
    id: 'spark-stripe',
    name: 'SparkPay',
    tagline: 'Universal Payment Backend',
    description: 'Universal Stripe payment backend. Deploy once, add payments to any app.',
    icon: '/imgs/apps/spark-stripe.png',
    tags: ['Payments', 'Stripe', 'Backend'],
  },
  {
    id: 'klean',
    name: 'KLean',
    tagline: 'Project Cleanup CLI',
    description: 'CLI to analyze, clean, and refactor any project.',
    icon: '/imgs/apps/klean.png',
    tags: ['CLI', 'DevTools', 'Cleanup'],
  },
];
