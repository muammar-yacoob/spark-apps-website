'use client';

import { ColorPicker } from '@/app/_components/ui/ColorPicker';
import { DateInput } from '@/app/_components/ui/DateInput';
import { StatusBadge } from '@/app/_components/ui/StatusBadge';
import { SITE_NAME } from '@/lib/config/site';
import { Bell, LayoutDashboard, Palette } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import styles from '../dashboard.module.css';

export function SettingsView() {
  const [color, setColor] = useState('#3b82f6');
  const [date, setDate] = useState('');
  const [siteName, setSiteName] = useState(SITE_NAME);
  const [timezone, setTimezone] = useState('UTC');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  function handleSave() {
    toast.success('Settings saved (demo only)');
  }

  return (
    <div className={styles.contentPanel}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General settings */}
        <div className={`${styles.panel} ${styles.appCard} p-5`}>
          <div
            className={`flex items-center gap-2 mb-4 ${styles.iconPopTrigger}`}
            suppressHydrationWarning
          >
            <LayoutDashboard
              suppressHydrationWarning
              className={`w-4 h-4 text-blue-400 ${styles.iconPop}`}
            />
            <h3 className="text-sm font-semibold text-white">General</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="site-name" className={styles.label}>
                Site Name
              </label>
              <input
                id="site-name"
                className={styles.input}
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="timezone" className={styles.label}>
                Timezone
              </label>
              <select
                id="timezone"
                className={styles.select}
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
            <div>
              <span className={styles.label}>Status</span>
              <div className="flex gap-2 mt-1">
                <StatusBadge status="active" />
                <StatusBadge status="trialing" />
                <StatusBadge status="paused" />
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className={`${styles.panel} ${styles.appCard} p-5`} style={{ animationDelay: '80ms' }}>
          <div
            className={`flex items-center gap-2 mb-4 ${styles.iconPopTrigger}`}
            suppressHydrationWarning
          >
            <Palette
              suppressHydrationWarning
              className={`w-4 h-4 text-violet-400 ${styles.iconPop}`}
            />
            <h3 className="text-sm font-semibold text-white">Appearance</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="brand-color" className={styles.label}>
                Brand Color
              </label>
              <ColorPicker id="brand-color" value={color} onChange={setColor} />
            </div>
            <div>
              <label htmlFor="launch-date" className={styles.label}>
                Launch Date
              </label>
              <DateInput id="launch-date" value={date} onChange={setDate} variant="pill" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div
          className={`${styles.panel} ${styles.appCard} p-5`}
          style={{ animationDelay: '160ms' }}
        >
          <div
            className={`flex items-center gap-2 mb-4 ${styles.iconPopTrigger}`}
            suppressHydrationWarning
          >
            <Bell suppressHydrationWarning className={`w-4 h-4 text-amber-400 ${styles.iconPop}`} />
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-300">Email notifications</p>
                <p className="text-[10px] text-gray-600">Receive updates about your account</p>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsEnabled((v) => !v)}
                className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${notificationsEnabled ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors btn-shimmer"
        >
          Save settings
        </button>
      </div>
    </div>
  );
}
