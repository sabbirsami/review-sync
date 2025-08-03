'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

// Enhanced Icons
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ReviewsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <circle cx="12" cy="13" r="2" />
    <path d="M12 17v-2" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18" />
    <path d="M7 12l3-3 3 3 5-5" />
    <circle cx="7" cy="12" r="1" />
    <circle cx="10" cy="9" r="1" />
    <circle cx="13" cy="12" r="1" />
    <circle cx="18" cy="7" r="1" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const BusinessIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
    <path d="M9 7h6" />
  </svg>
);

const AutomationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="13" rx="2" />
    <path d="M8 9l3 3-3 3" />
    <path d="M13 15h3" />
  </svg>
);

const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

interface NavItem {
  path?: string;
  label: string;
  icon: React.ComponentType;
  subRoutes?: { path: string; label: string; badge?: string | number }[];
  badge?: string | number;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [openItem, setOpenItem] = useState<string | null>(null);

  const menuItems: NavItem[] = [
    {
      path: '/',
      label: 'Overview',
      icon: DashboardIcon,
    },
    {
      label: 'Reviews',
      icon: ReviewsIcon,
      badge: '24',
      subRoutes: [
        { path: '/reviews/all', label: 'All Reviews', badge: '74' },
        { path: '/reviews/pending', label: 'Pending Replies', badge: '12' },
        { path: '/reviews/replied', label: 'Replied', badge: '62' },
        { path: '/reviews/negative', label: 'Negative Reviews', badge: '3' },
      ],
    },
    {
      label: 'Business Profiles',
      icon: BusinessIcon,
      subRoutes: [
        { path: '/business-profiles/1', label: 'Main Branch', badge: '32' },
        { path: '/business-profiles/2', label: 'Downtown', badge: '28' },
        { path: '/business-profiles/3', label: 'Mall Branch', badge: '14' },
      ],
    },
    {
      label: 'Analytics',
      icon: AnalyticsIcon,
      subRoutes: [
        { path: '/analytics/response-rate', label: 'Response Rate' },
        { path: '/analytics/rating-trends', label: 'Rating Trends' },
        { path: '/analytics/sentiment', label: 'Sentiment Analysis' },
      ],
    },
    {
      label: 'Automation',
      icon: AutomationIcon,
      badge: 'NEW',
      subRoutes: [
        { path: '/automation/workflows', label: 'AI Workflows' },
        { path: '/automation/templates', label: 'Reply Templates' },
        { path: '/automation/settings', label: 'Auto-Reply Settings' },
      ],
    },
  ];

  const bottomNavItems: NavItem[] = [
    { path: '/help', label: 'Help Center', icon: HelpIcon },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="h-screen sticky top-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col shadow-2xl">
      {/* Enhanced Logo Section */}
      <div className="py-6 px-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-xl text-white">ReviewSync</span>
            <div className="text-xs text-slate-400">Professional</div>
          </div>
        </div>
      </div>

      {/* Enhanced Search */}
      <div className="p-4">
        <div className="relative group">
          <div className="absolute text-slate-400 group-focus-within:text-blue-400 inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Quick search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl leading-5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm text-white backdrop-blur-sm transition-all"
          />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        <div>
          {menuItems.map((item, index) => (
            <div key={index} className="mb-1">
              {item.subRoutes ? (
                <Accordion
                  type="single"
                  collapsible
                  value={openItem || undefined}
                  onValueChange={setOpenItem}
                >
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <AccordionTrigger className="w-full py-3 px-4 hover:bg-slate-800/50 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:no-underline group transition-all duration-200">
                      <span className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-3">
                          <span className="group-hover:text-blue-400 transition-colors">
                            <item.icon />
                          </span>
                          <span>{item.label}</span>
                        </span>
                        {item.badge && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              typeof item.badge === 'string'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="ml-8 mt-2 space-y-1">
                        {item.subRoutes.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.path}
                            className={`flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                              pathname.startsWith(subItem.path)
                                ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 font-medium border border-blue-500/30 shadow-lg shadow-blue-500/10'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-2 h-2 rounded-full mr-3 ${
                                  pathname.startsWith(subItem.path) ? 'bg-blue-400' : 'bg-slate-500'
                                }`}
                              ></div>
                              <span>{subItem.label}</span>
                            </div>
                            {subItem.badge && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  pathname.startsWith(subItem.path)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-slate-700 text-slate-400'
                                }`}
                              >
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link
                  href={item.path!}
                  className={`flex items-center justify-between w-full text-sm py-3 px-4 rounded-xl transition-all duration-200 font-medium group ${
                    isActive(item.path!)
                      ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 font-semibold border border-blue-500/30 shadow-lg shadow-blue-500/10'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`group-hover:text-blue-400 transition-colors ${
                        isActive(item.path!) ? 'text-blue-400' : ''
                      }`}
                    >
                      <item.icon />
                    </span>
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        typeof item.badge === 'string'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                          : isActive(item.path!)
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Enhanced Bottom Section */}
      <div className="border-t border-slate-700/50 p-4 bg-slate-900/50 backdrop-blur-sm">
        {/* User Profile Section */}
        <div className="mb-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">John Doe</div>
              <div className="text-xs text-slate-400 truncate">Business Owner</div>
            </div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path!);
            return (
              <Link
                key={item.label}
                href={item.path!}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-slate-800 text-white border border-slate-600'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <span
                  className={`group-hover:text-blue-400 transition-colors ${
                    active ? 'text-blue-400' : ''
                  }`}
                >
                  <Icon />
                </span>
                <span className="ml-3">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Version Info */}
        <div className="mt-4 text-center">
          <div className="text-xs text-slate-500">v2.1.0</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
