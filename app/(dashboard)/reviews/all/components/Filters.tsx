'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { exportToPdf } from '@/lib/generatePdf';
import { Download, RefreshCw, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react'; // Import useEffect and useState

export default function Filters({
  searchTerm,
  filterStatus,
  filterRating,
  filterProfile,
  uniqueProfiles,
}: {
  searchTerm: string;
  filterStatus: string;
  filterRating: string;
  filterProfile: string;
  uniqueProfiles: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for the search input to enable debouncing
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Effect to update the URL after a debounce period
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only update if the local search term is different from the URL's search term
      if (localSearchTerm !== searchParams.get('search')) {
        handleFilterChange('search', localSearchTerm);
      }
    }, 500); // 500ms debounce time

    // Cleanup function to clear the timeout if the input changes again
    return () => {
      clearTimeout(handler);
    };
  }, [localSearchTerm, searchParams]); // Depend on localSearchTerm and searchParams

  // Keep localSearchTerm in sync with external searchTerm prop (e.g., on page load or clear filters)
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      // Reset page to 1 when filters change
      params.set('page', '1');
      return params.toString();
    },
    [searchParams],
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + '?' + createQueryString(name, value));
  };

  const handleExport = async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const container =
      document.getElementById('reviews-container') || document.querySelector('.reviews-container');
    if (!container) {
      console.error('Export container not found');
      return;
    }
    exportToPdf(
      container.id || 'reviews-container',
      `reviews-export-${new Date().toISOString().split('T')[0]}`,
    );
  };

  const handleClearAll = () => {
    router.push(pathname); // Navigate to base path to clear all search params
  };

  return (
    <div className="grid grid-cols-1 bg-white md:grid-cols-2 lg:grid-cols-8 gap-4 py-3 px-6">
      <div className="relative group col-span-2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 !text-foreground/60 w-4 h-4 group-focus-within:!text-primary" />
        <Input
          placeholder="Search reviews, customers..."
          value={localSearchTerm} // Use local state for input value
          onChange={(e) => setLocalSearchTerm(e.target.value)} // Update local state immediately
          className="pl-10 border-none shadow-none focus:border-primary focus:ring-primary/20 !bg-background"
        />
      </div>

      <Select value={filterStatus} onValueChange={(value) => handleFilterChange('status', value)}>
        <SelectTrigger className="border-none shadow-none hover:!bg-background !bg-white w-full">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="replied">Replied</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="ignored">Ignored</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filterRating} onValueChange={(value) => handleFilterChange('rating', value)}>
        <SelectTrigger className="border-none shadow-none !bg-white w-full hover:!bg-background">
          <SelectValue placeholder="Filter by rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ratings</SelectItem>
          <SelectItem value="FIVE">⭐⭐⭐⭐⭐ (5 Stars)</SelectItem>
          <SelectItem value="FOUR">⭐⭐⭐⭐ (4 Stars)</SelectItem>
          <SelectItem value="THREE">⭐⭐⭐ (3 Stars)</SelectItem>
          <SelectItem value="TWO">⭐⭐ (2 Stars)</SelectItem>
          <SelectItem value="ONE">⭐ (1 Star)</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filterProfile}
        onValueChange={(value) => handleFilterChange('profileId', value)}
      >
        <SelectTrigger className="border-none shadow-none !bg-white w-full hover:!bg-background border-s">
          <SelectValue placeholder="Filter by location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {uniqueProfiles.map((profileId, index) => (
            <SelectItem key={`profile-${profileId}-${index}`} value={profileId}>
              {profileId}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={handleClearAll}
        variant="outline"
        className="border-none shadow-none w-full !bg-white hover:!bg-red-700 hover:!border-red-300 hover:!shadow-lg shadow-red-700/70 hover:!text-white"
      >
        Clear All
      </Button>

      <div className="flex w-full items-center gap-3 col-span-2 ms-2 border-s ps-6">
        <Button
          onClick={handleExport}
          variant="outline"
          className="!bg-chart-3 hover:!shadow-lg !shadow-chart-3/70 border-none shadow-none w-[40%]"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button
          onClick={() => router.refresh()}
          className="bg-gradient-to-r from-primary to-foreground hover:shadow-lg shadow-chart-1/70 text-white w-[50%]"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
