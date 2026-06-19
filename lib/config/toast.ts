/** Shared Sonner Toaster props -- use everywhere a <Toaster> is rendered. */
export const TOAST_CONFIG = {
  position: 'top-center' as const,
  theme: 'dark' as const,
  toastOptions: {
    style: {
      background: '#0d1117',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '10px',
      color: '#e5e7eb',
      fontSize: '13px',
    },
  },
};
