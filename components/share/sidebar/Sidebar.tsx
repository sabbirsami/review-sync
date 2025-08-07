'use client';

import SearchIcon from '@/components/icons/SearchIcon';
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

// Enhanced Icons (same as before)
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
const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

interface NavItem {
  path?: string;
  label: string;
  icon: React.ComponentType;
  subRoutes?: {
    path: string;
    label: string;
    icon?: React.ComponentType;
    badge?: string | number;
  }[];
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [isProfileChanging, setIsProfileChanging] = useState(false); // New state for profile change loading

  // Fetch business profiles on component mount
  useEffect(() => {
    fetchBusinessProfiles();
  }, []);

  // Set selected profile from URL or default to first profile
  useEffect(() => {
    const profileIdFromUrl = searchParams.get('profileId');
    if (profileIdFromUrl && profileIdFromUrl !== selectedProfile) {
      setSelectedProfile(profileIdFromUrl);
    } else if (businessProfiles.length > 0 && !selectedProfile && !profileIdFromUrl) {
      // Default to first business profile
      const firstProfile = businessProfiles[0];
      setSelectedProfile(firstProfile.profileId);
      // Update URL with the first profile
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('profileId', firstProfile.profileId);
      router.replace(`${pathname}${currentUrl.search}`);
    }
  }, [searchParams, businessProfiles, selectedProfile, pathname, router]);

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

  const handleProfileChange = async (profileId: string) => {
    if (profileId === selectedProfile) return; // Prevent unnecessary changes

    setIsProfileChanging(true); // Start loading
    setSelectedProfile(profileId);

    // Update URL with the selected profileId
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('profileId', profileId);
    // Use router.replace to update URL without page reload
    router.replace(`${pathname}${currentUrl.search}`);

    // Add a small delay to show loading state
    setTimeout(() => {
      setIsProfileChanging(false);
    }, 1000);
  };

  const getSelectedProfileName = () => {
    const profile = businessProfiles.find((p) => p.profileId === selectedProfile);
    return profile ? profile?.profileName?.split('-')[1] : 'Loading...';
  };

  // Rest of the component remains the same until the Select section
  const menuItems: NavItem[] = [
    {
      path: '/',
      label: 'Overview',
      icon: DashboardIcon,
    },
    {
      label: 'Reviews',
      icon: ReviewsIcon,
      subRoutes: [{ path: '/reviews/all', label: 'All Reviews', icon: ReviewsIcon, badge: '' }],
    },
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
                <div className="mb-4">
                  <p className="text-sm font-semibold text-sidebar-foreground px-4 pt-5 pb- mb-2">
                    {item.label}
                  </p>
                  <div className="space-y-1">
                    {item.subRoutes.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={`${subItem.path}${
                          selectedProfile ? `?profileId=${selectedProfile}` : ''
                        }`}
                        className={`flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
                          pathname.startsWith(subItem.path)
                            ? 'bg-sidebar-primary/10 text-sidebar-primary font-medium border border-sidebar-primary/30 shadow-lg shadow-sidebar-primary/10'
                            : 'text-sidebar-muted-foreground hover:bg-sidebar-primary/10 hover:text-sidebar-primary hover:border hover:border-sidebar-primary/30'
                        }`}
                      >
                        <div className="flex items-center">
                          {subItem.icon ? (
                            <span
                              className={`mr-3 ${
                                pathname.startsWith(subItem.path)
                                  ? 'text-sidebar-primary'
                                  : 'text-sidebar-muted-foreground'
                              }`}
                            >
                              <subItem.icon />
                            </span>
                          ) : (
                            <div
                              className={`w-2 h-2 rounded-full mr-3 ${
                                pathname.startsWith(subItem.path)
                                  ? 'bg-sidebar-primary'
                                  : 'bg-sidebar-muted-foreground'
                              }`}
                            ></div>
                          )}
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
                </div>
              ) : (
                <Link
                  href={`${item.path!}${selectedProfile ? `?profileId=${selectedProfile}` : ''}`}
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
      <div className="border-t border-sidebar-border">
        <div className="mb-2 px-1 shadow-lg shadow-primary/5 border-primary/40 border mt-4 mx-4 pb-0.5 rounded-2xl relative">
          {/* Business Profile Selector */}
          <label className="text-xs px-3 pt-2.5 -mb-1 text-sidebar-foreground/70 block">
            Select Business Profile
          </label>
          <div className="relative">
            {/* Loading Overlay */}
            {isProfileChanging && (
              <div className="absolute inset-0 bg-sidebar z-10 flex items-center justify-start ms-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary/20 border-t-primary"></div>
                  <span className="text-sm text-primary">Loading...</span>
                </div>
              </div>
            )}

            <Select
              value={selectedProfile}
              onValueChange={handleProfileChange}
              disabled={isLoadingProfiles || isProfileChanging}
            >
              <SelectTrigger className="!bg-sidebar shadow-none w-full bg-sidebar-muted border-0 border-sidebar-border text-sidebar-foreground">
                <div className="flex items-center gap-2 text-sidebar-foreground text-lg font-semibold">
                  <SelectValue className="text-wrap">
                    {isLoadingProfiles ? 'Loading...' : getSelectedProfileName()}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-sidebar border-sidebar-border">
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
