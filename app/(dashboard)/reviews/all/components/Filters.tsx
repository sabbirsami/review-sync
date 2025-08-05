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
import { Download, RefreshCw, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

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

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + '?' + createQueryString(name, value));
  };

  const handleClearAll = () => {
    router.push(pathname);
  };

  return (
    <div className="grid grid-cols-1 bg-white md:grid-cols-2 lg:grid-cols-8 gap-4 py-3 px-6">
      <div className="relative group col-span-2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1B5551]/60 w-4 h-4 group-focus-within:text-[#0B5C58]" />
        <Input
          placeholder="Search reviews, customers..."
          value={searchTerm}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="pl-10 border-none shadow-none focus:border-[#0B5C58] focus:ring-[#0B5C58]/20 bg-background"
        />
      </div>

      <Select value={filterStatus} onValueChange={(value) => handleFilterChange('status', value)}>
        <SelectTrigger className="border-none shadow-none hover:bg-background bg-white w-full">
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
        <SelectTrigger className="border-none shadow-none bg-white w-full hover:bg-background">
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

      <Select value={filterProfile} onValueChange={(value) => handleFilterChange('profile', value)}>
        <SelectTrigger className="border-none shadow-none bg-white w-full hover:bg-background border-s">
          <SelectValue placeholder="Filter by location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {uniqueProfiles.map((profile) => (
            <SelectItem key={profile} value={profile}>
              {profile}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={handleClearAll}
        variant="outline"
        className="border-none shadow-none w-full bg-white hover:bg-red-700 hover:border-red-300 hover:shadow-lg shadow-red-700/70 hover:text-white"
      >
        Clear All
      </Button>

      <div className="flex w-full items-center gap-3 col-span-2 ms-2 border-s ps-6">
        <Button
          variant="outline"
          className="bg-chart-3 hover:shadow-lg shadow-chart-3/70 border-none shadow-none w-[40%]"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button
          onClick={() => router.refresh()}
          className="bg-gradient-to-r from-[#0B5C58] to-[#1B5551] hover:shadow-lg shadow-chart-1/70 text-white w-[50%]"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
