'use client';

import SearchIcon from '@/components/icons/SearchIcon';
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

// Icons (using Lucide-react icons which match your style)
const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ReviewsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const BusinessIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const AutomationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M8 6h8" />
    <path d="M16 14h.01" />
    <path d="M12 14h.01" />
    <path d="M8 14h.01" />
    <path d="M12 18h.01" />
    <path d="M8 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);

const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <circle cx="12" cy="17" r="1" />
  </svg>
);

interface NavItem {
  path?: string;
  label: string;
  icon: React.ComponentType;
  subRoutes?: { path: string; label: string }[];
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
      subRoutes: [
        { path: '/reviews/all', label: 'All Reviews' },
        { path: '/reviews/pending', label: 'Pending Replies' },
        { path: '/reviews/replied', label: 'Replied' },
        { path: '/reviews/negative', label: 'Negative' },
      ],
    },
    {
      label: 'Business Profiles',
      icon: BusinessIcon,
      subRoutes: [
        { path: '/business-profiles/1', label: 'Profile 1' },
        { path: '/business-profiles/2', label: 'Profile 2' },
        { path: '/business-profiles/3', label: 'Profile 3' },
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
      subRoutes: [
        { path: '/automation/workflows', label: 'Workflows' },
        { path: '/automation/templates', label: 'Reply Templates' },
        { path: '/automation/settings', label: 'Settings' },
      ],
    },
  ];

  const bottomNavItems: NavItem[] = [
    { path: '/help', label: 'Help Center', icon: HelpIcon },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="py-4 px-7 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-lg ">ReviewSync</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-6 pb-3">
        <div className="relative">
          <div className="absolute text-gray-500 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#90C67C] focus:border-[#90C67C] text-sm"
          />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-6 py-4 space-y-1 overflow-y-auto">
        <div>
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.subRoutes ? (
                <Accordion
                  type="single"
                  collapsible
                  value={openItem || undefined}
                  onValueChange={setOpenItem}
                >
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <AccordionTrigger className="w-full py-3 mb-0.5 px-3 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:no-underline">
                      <span className="flex items-center gap-3">
                        <item.icon />
                        {item.label}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="ml-8 space-y-1">
                        {item.subRoutes.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.path}
                            className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                              pathname.startsWith(subItem.path)
                                ? 'bg-[#E1EEBC]/50 text-[#328E6E]  font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                              {subItem.label}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link
                  href={item.path!}
                  className={`flex items-center gap-3 w-full text-sm py-3 mb-0.5 px-3 rounded-lg transition-colors font-medium ${
                    isActive(item.path!)
                      ? 'bg-[#E1EEBC]/50 text-[#328E6E] font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon />
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-200 p-4">
        {/* Bottom navigation */}
        <nav className="mt-4 px-4">
          <ul className="space-y-1">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path!);
              return (
                <li key={item.label}>
                  <Link
                    href={item.path!}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
