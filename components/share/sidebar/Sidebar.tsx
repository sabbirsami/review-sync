'use client';

import SearchIcon from '@/components/icons/SearchIcon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import SettingsPanel from '../SettingsPanel';

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
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

interface NavItem {
  path?: string;
  label: string;
  icon: React.ComponentType;
  subRoutes?: { path: string; label: string; badge?: string | number }[];
  badge?: string | number;
  isSheet?: boolean;
}

interface BusinessProfile {
  profileId: string;
  profileName: string;
  totalReviews: number;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('all');
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);

  // Get current profile from URL params
  useEffect(() => {
    const profileIdFromUrl = searchParams.get('profileId') || 'all';
    setSelectedProfile(profileIdFromUrl);
  }, [searchParams]);

  // Fetch business profiles on component mount
  useEffect(() => {
    fetchBusinessProfiles();
  }, []);

  const fetchBusinessProfiles = async () => {
    try {
      setIsLoadingProfiles(true);
      const response = await fetch('/api/stats');
      const data = await response.json();
      if (data.profileStats && Array.isArray(data.profileStats)) {
        setBusinessProfiles(data.profileStats);
      }
    } catch (error) {
      console.error('Failed to fetch business profiles:', error);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const handleProfileChange = (profileId: string) => {
    setSelectedProfile(profileId);
    // Update URL with the selected profileId
    const currentUrl = new URL(window.location.href);
    if (profileId === 'all') {
      currentUrl.searchParams.delete('profileId');
    } else {
      currentUrl.searchParams.set('profileId', profileId);
    }
    // Use router.replace to update URL without page reload
    router.replace(`${pathname}${currentUrl.search}`);
  };

  const getSelectedProfileName = () => {
    if (selectedProfile === 'all') return 'All Profiles';
    const profile = businessProfiles.find((p) => p.profileId === selectedProfile);
    return profile ? profile?.profileName?.split('-')[1] : 'Unknown Profile';
  };

  const menuItems: NavItem[] = [
    {
      path: '/',
      label: 'Overview',
      icon: DashboardIcon,
    },
    {
      label: 'Reviews',
      icon: ReviewsIcon,
      // badge: '24',
      subRoutes: [
        { path: '/reviews/all', label: 'All Reviews', badge: '' },
        // { path: '/reviews/pending', label: 'Pending Replies', badge: '12' },
        // { path: '/reviews/replied', label: 'Replied', badge: '62' },
        // { path: '/reviews/negative', label: 'Negative Reviews', badge: '3' },
      ],
    },
    // {
    //   label: 'Business Profiles',
    //   icon: BusinessIcon,
    //   subRoutes: [
    //     { path: '/business-profiles/1', label: 'Main Branch', badge: '32' },
    //     { path: '/business-profiles/2', label: 'Downtown', badge: '28' },
    //     { path: '/business-profiles/3', label: 'Mall Branch', badge: '14' },
    //   ],
    // },
    // {
    //   label: 'Analytics',
    //   icon: AnalyticsIcon,
    //   subRoutes: [
    //     { path: '/analytics/response-rate', label: 'Response Rate' },
    //     { path: '/analytics/rating-trends', label: 'Rating Trends' },
    //     { path: '/analytics/sentiment', label: 'Sentiment Analysis' },
    //   ],
    // },
    // {
    //   label: 'Automation',
    //   icon: AutomationIcon,
    //   badge: 'NEW',
    //   subRoutes: [
    //     { path: '/automation/workflows', label: 'AI Workflows' },
    //     { path: '/automation/templates', label: 'Reply Templates' },
    //     { path: '/automation/settings', label: 'Auto-Reply Settings' },
    //   ],
    // },
  ];

  const bottomNavItems: NavItem[] = [
    { path: '/help', label: 'Help Center', icon: HelpIcon },
    { label: 'Settings', icon: SettingsIcon, isSheet: true },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="h-screen sticky top-0 bg-sidebar flex flex-col shadow-2xl border-r border-sidebar-border">
      {/* Enhanced Logo Section */}
      <div className="py-5 px-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <Image
            src="/logo-primary.png"
            className="h-8 w-auto"
            width={110}
            height={110}
            alt="ReviewSync Logo"
          />
          <div>
            <span className="font-bold text-xl text-sidebar-foreground">ReviewSync</span>
            <div className="text-xs text-sidebar-muted-foreground -mt-0.5 ps-0.5">Professional</div>
          </div>
        </div>
      </div>

      {/* Enhanced Search */}
      <div className="p-4">
        <div className="relative group">
          <div className="absolute text-sidebar-muted-foreground group-focus-within:text-sidebar-accent inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Quick search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 bg-sidebar-muted border border-sidebar-border rounded-xl leading-5 placeholder-sidebar-muted-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring/50 focus:border-sidebar-accent text-sm text-sidebar-foreground transition-all"
          />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-muted-foreground/30 scrollbar-track-sidebar-muted">
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
                    <AccordionTrigger className="w-full cursor-pointer py-3 px-4 hover:bg-sidebar-primary/10 hover:border hover:border-sidebar-primary/30 rounded-xl text-sm font-medium text-sidebar-foreground hover:text-sidebar-primary hover:no-underline group transition-all duration-200">
                      <span className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-3">
                          <span className="group-hover:text-primary transition-colors">
                            <item.icon />
                          </span>
                          <span>{item.label}</span>
                        </span>
                        {item.badge && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              typeof item.badge === 'string'
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                : 'bg-sidebar-muted text-sidebar-muted-foreground'
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
                            href={`${subItem.path}${
                              selectedProfile !== 'all' ? `?profileId=${selectedProfile}` : ''
                            }`}
                            className={`flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                              pathname.startsWith(subItem.path)
                                ? 'bg-sidebar-primary/10 text-sidebar-primary font-medium border border-sidebar-primary/30 shadow-lg shadow-sidebar-primary/10'
                                : 'text-sidebar-muted-foreground hover:bg-sidebar-primary/10 hover:text-sidebar-primary hover:border hover:border-sidebar-primary/30'
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-2 h-2 rounded-full mr-3 ${
                                  pathname.startsWith(subItem.path)
                                    ? 'bg-sidebar-primary'
                                    : 'bg-sidebar-muted-foreground'
                                }`}
                              ></div>
                              <span>{subItem.label}</span>
                            </div>
                            {subItem.badge && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  pathname.startsWith(subItem.path)
                                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                    : 'bg-sidebar-muted text-sidebar-muted-foreground'
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
                  href={`${item.path!}${
                    selectedProfile !== 'all' ? `?profileId=${selectedProfile}` : ''
                  }`}
                  className={`flex items-center justify-between w-full text-sm py-3 px-4 rounded-xl transition-all duration-200 font-medium group ${
                    isActive(item.path!)
                      ? 'bg-sidebar-primary/10 text-sidebar-primary font-semibold border border-sidebar-primary/30 shadow-lg shadow-sidebar-primary/10'
                      : 'text-sidebar-foreground hover:bg-sidebar-primary/10 hover:text-sidebar-primary hover:border hover:border-sidebar-primary/30'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`group-hover:text-sidebar-accent transition-colors ${
                        isActive(item.path!) ? 'text-sidebar-primary' : ''
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
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : isActive(item.path!)
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'bg-sidebar-muted text-sidebar-muted-foreground'
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
      <div className="border-t border-sidebar-border  ">
        <div className="mb-2 px-1 shadow-lg shadow-primary/5 border-primary/40 border mt-4 mx-4 pb-0.5 rounded-2xl ">
          {/* Business Profile Selector */}
          <label className="text-xs  px-3 pt-2.5 -mb-1   text-sidebar-foreground/70  block">
            Select Business Profile
          </label>
          <div className=" ">
            <Select
              value={selectedProfile}
              onValueChange={handleProfileChange}
              disabled={isLoadingProfiles}
            >
              <SelectTrigger className="!bg-sidebar shadow-none w-full bg-sidebar-muted border-0 border-sidebar-border text-sidebar-foreground">
                <div className="flex items-center gap-2 text-sidebar-foreground text-lg font-semibold">
                  <SelectValue className="text-wrap ">
                    {isLoadingProfiles ? 'Loading...' : getSelectedProfileName()}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-sidebar border-sidebar-border">
                <SelectItem value="all" className="text-sidebar-foreground hover:bg-sidebar-muted">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-sidebar-accent rounded-full"></div>
                    All Profiles
                  </div>
                </SelectItem>
                {businessProfiles.map((profile) => (
                  <SelectItem
                    key={profile.profileId}
                    value={profile.profileId}
                    className="text-sidebar-foreground hover:bg-sidebar-muted"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-sidebar-primary rounded-full"></div>
                        <span className="truncate max-w-[120px]" title={profile?.profileName}>
                          {profile?.profileName?.split('-')[1] || 'Unknown Profile'}
                        </span>
                      </div>
                      <span className="text-xs bg-sidebar-accent text-sidebar-accent-foreground px-1.5 py-0.5 rounded-full ml-2">
                        {profile.totalReviews}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* {selectedProfile !== 'all' && (
              <div className="text-xs text-sidebar-muted-foreground mt-1">
                Showing data for selected profile
              </div>
            )} */}
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="space-y-1 p-4">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = item.path ? isActive(item.path) : false;
            if (item.isSheet) {
              return (
                <Sheet key={item.label} open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <SheetTrigger asChild>
                    <button
                      className={`group hover:bg-sidebar-muted hover:text-sidebar-foreground flex cursor-pointer items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        active
                          ? 'bg-sidebar-muted text-sidebar-foreground border border-sidebar-border'
                          : 'text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground'
                      }`}
                    >
                      <span
                        className={`group-hover:text-sidebar-accent transition-colors ${
                          active ? 'text-sidebar-primary' : ''
                        }`}
                      >
                        <Icon />
                      </span>
                      <span className="ml-3">{item.label}</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-card">
                    <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
                  </SheetContent>
                </Sheet>
              );
            }
            return (
              <Link
                key={item.label}
                href={item.path!}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-sidebar-muted text-sidebar-foreground border border-sidebar-border'
                    : 'text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground'
                }`}
              >
                <span
                  className={`group-hover:text-sidebar-accent transition-colors ${
                    active ? 'text-sidebar-primary' : ''
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
        <div className="mt-4 mb-1 text-center">
          <div className="text-xs text-sidebar-muted-foreground">v2.1.0</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
