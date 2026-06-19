export interface SparkApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  links?: { label: string; url: string }[];
}

export const sparkApps: SparkApp[] = [
  {
    id: 'sparkstack',
    name: 'SparkStack',
    description: 'The full-stack starter that sparks your next project.',
    icon: '/imgs/apps/sparkstack.png',
    tags: ['Next.js', 'Starter', 'Full-Stack'],
  },
  {
    id: 'sellular',
    name: 'Sellular',
    description: 'AI-powered SEO, directory listings, and discoverability tools for SaaS.',
    icon: '/imgs/apps/sellular.png',
    tags: ['SEO', 'AI', 'Marketing'],
  },
  {
    id: 'bottled',
    name: 'Bottled',
    description: 'Send messages in bottles across the digital ocean. Pro email on your domain.',
    icon: '/imgs/apps/bottled.png',
    tags: ['Email', 'Communication'],
  },
  {
    id: 'vidlet',
    name: 'VidLet',
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
    description: 'Social media content scheduler and analytics dashboard.',
    icon: '/imgs/apps/viralcat.png',
    tags: ['Social Media', 'Analytics'],
  },
  {
    id: 'quickpeek',
    name: 'QuickPeek',
    description: 'Auto-generate demo videos for your web app with AI.',
    icon: '/imgs/apps/quickpeek.png',
    tags: ['AI', 'Video', 'Demo'],
  },
  {
    id: 'botornot',
    name: 'BotOrNot',
    description: 'AI content detection. Chrome extension and PWA.',
    icon: '/imgs/apps/botornot.png',
    tags: ['AI', 'Chrome Extension', 'Detection'],
  },
  {
    id: 'spark-ai',
    name: 'SparkAI',
    description: 'AI chat widget with voice, live chat, and ticketing.',
    icon: '/imgs/apps/spark-ai.png',
    tags: ['AI', 'Chat', 'Widget'],
  },
  {
    id: 'spark-stripe',
    name: 'SparkPay',
    description: 'Universal Stripe payment backend. Deploy once, add payments to any app.',
    icon: '/imgs/apps/spark-stripe.png',
    tags: ['Payments', 'Stripe', 'Backend'],
  },
  {
    id: 'klean',
    name: 'KLean',
    description: 'CLI to analyze, clean, and refactor any project.',
    icon: '/imgs/apps/klean.png',
    tags: ['CLI', 'DevTools', 'Cleanup'],
  },
];
