import {
  BarChart3,
  Box,
  Brain,
  Code,
  CreditCard,
  Globe,
  Layers,
  Mail,
  MessageSquare,
  Monitor,
  Puzzle,
  Rocket,
  Search,
  Server,
  Share2,
  Shield,
  Terminal,
  Video,
  Wrench,
  Zap,
} from 'lucide-react';

export interface TagStyle {
  color: string;
  icon: React.ElementType;
}

export const tagConfig: Record<string, TagStyle> = {
  AI: { color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: Brain },
  Video: { color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', icon: Video },
  Web: { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Globe },
  Desktop: { color: 'text-slate-400 bg-slate-400/10 border-slate-400/20', icon: Monitor },
  Tools: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Wrench },
  SEO: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: Search },
  Marketing: { color: 'text-pink-400 bg-pink-400/10 border-pink-400/20', icon: Zap },
  Starter: { color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20', icon: Rocket },
  'Full-Stack': { color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', icon: Layers },
  Email: { color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: Mail },
  Domain: { color: 'text-teal-400 bg-teal-400/10 border-teal-400/20', icon: Globe },
  Communication: { color: 'text-teal-400 bg-teal-400/10 border-teal-400/20', icon: Mail },
  'Social Media': { color: 'text-pink-400 bg-pink-400/10 border-pink-400/20', icon: Share2 },
  Analytics: { color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', icon: BarChart3 },
  Demo: { color: 'text-violet-400 bg-violet-400/10 border-violet-400/20', icon: Video },
  'Chrome Extension': {
    color: 'text-green-400 bg-green-400/10 border-green-400/20',
    icon: Puzzle,
  },
  Detection: { color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: Shield },
  Chat: { color: 'text-sky-400 bg-sky-400/10 border-sky-400/20', icon: MessageSquare },
  Widget: { color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: Box },
  Payments: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CreditCard },
  Stripe: { color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: Zap },
  Backend: { color: 'text-slate-400 bg-slate-400/10 border-slate-400/20', icon: Server },
  CLI: { color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: Terminal },
  DevTools: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Code },
  Cleanup: { color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: Wrench },
  'Next.js': { color: 'text-white bg-white/10 border-white/20', icon: Layers },
};

export const fallbackTag: TagStyle = {
  color: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  icon: Box,
};
