'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface BusinessProfileContextType {
  selectedProfileId: string;
  setSelectedProfileId: (profileId: string) => void;
}

const BusinessProfileContext = createContext<BusinessProfileContextType | undefined>(undefined);

export function BusinessProfileProvider({
  children,
  initialProfileId,
}: {
  children: React.ReactNode;
  initialProfileId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedProfileId, setInternalSelectedProfileId] = useState(initialProfileId);

  // Effect to update internal state when URL search params change (e.g., on direct URL access or browser back/forward)
  useEffect(() => {
    const profileIdFromUrl = searchParams.get('profileId') || 'all';
    if (profileIdFromUrl !== selectedProfileId) {
      setInternalSelectedProfileId(profileIdFromUrl);
    }
  }, [searchParams, selectedProfileId]);

  // Function to update both context and URL
  const setSelectedProfileId = useCallback(
    (profileId: string) => {
      setInternalSelectedProfileId(profileId);

      const currentUrl = new URL(window.location.href);
      if (profileId === 'all') {
        currentUrl.searchParams.delete('profileId');
      } else {
        currentUrl.searchParams.set('profileId', profileId);
      }
      // Use router.replace to update URL without full page reload
      router.replace(`${pathname}${currentUrl.search}`);
    },
    [pathname, router],
  );

  return (
    <BusinessProfileContext.Provider value={{ selectedProfileId, setSelectedProfileId }}>
      {children}
    </BusinessProfileContext.Provider>
  );
}

export function useBusinessProfile() {
  const context = useContext(BusinessProfileContext);
  if (context === undefined) {
    throw new Error('useBusinessProfile must be used within a BusinessProfileProvider');
  }
  return context;
}
