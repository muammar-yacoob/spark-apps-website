import { SITE_NAME, SITE_URL } from '@/lib/config/site';
import { TAGLINES } from '@/lib/config/taglines';
import type { SocialShareConfig } from './SocialShareButton';

export const SHARE_CONFIG: SocialShareConfig = {
  appName: SITE_NAME,
  appUrl: SITE_URL,
  appIcon: '/favicon.ico',
  hashtags: 'Sellular,SaaS,IndieHacker',
  messageEndpoint: null,
  taglines: TAGLINES,
};
