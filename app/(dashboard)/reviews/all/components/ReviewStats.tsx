/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Clock, MessageSquare, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ReviewStatsProps {
  searchTerm: string;
  filterStatus: string;
  filterRating: string;
  filterProfile: string;
}

interface StatsData {
  totalReviews: number;
  pendingReplies: number;
  averageRating: number;
}

export default function ReviewStats({
  searchTerm,
  filterStatus,
  filterRating,
  filterProfile,
}: ReviewStatsProps) {
  const [stats, setStats] = useState<StatsData>({
    totalReviews: 0,
    pendingReplies: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        setLoading(true);

        // Use the stats API endpoint instead of reviews API to get accurate totals
        const queryParams = new URLSearchParams();

        // Add filters if they exist
        if (filterStatus !== 'all') queryParams.set('status', filterStatus);
        if (filterRating !== 'all') queryParams.set('rating', filterRating);
        if (filterProfile !== 'all') queryParams.set('profileId', filterProfile);
        if (searchTerm) queryParams.set('search', searchTerm);

        const response = await fetch(`/api/stats/filtered?${queryParams}`);
        const data = await response.json();

        if (data.success) {
          setStats({
            totalReviews: data.totalReviews,
            pendingReplies: data.pendingReplies,
            averageRating: data.averageRating,
          });
        } else {
          // Fallback to the old method if the new endpoint doesn't exist
          const fallbackResponse = await fetch(`/api/reviews?limit=50000&page=1&${queryParams}`);
          const fallbackData = await fallbackResponse.json();

          if (fallbackData.success && fallbackData.data) {
            const reviews = fallbackData.data.reviews;

            const totalReviews = fallbackData.data.total; // Use the total from API response
            const pendingReviews = reviews.filter((r: any) => r.replyStatus === 'pending').length;

            const avgRating =
              reviews.length > 0
                ? reviews.reduce((acc: number, r: any) => {
                    const rating =
                      r.starRating === 'ONE'
                        ? 1
                        : r.starRating === 'TWO'
                        ? 2
                        : r.starRating === 'THREE'
                        ? 3
                        : r.starRating === 'FOUR'
                        ? 4
                        : 5;
                    return acc + rating;
                  }, 0) / reviews.length
                : 0;

            setStats({
              totalReviews,
              pendingReplies: pendingReviews,
              averageRating: avgRating,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, [searchTerm, filterStatus, filterRating, filterProfile]);

  if (loading) {
    return (
      <div className="grid grid-cols-3 items-center">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 px-8 py-8 border-2 border-white bg-gray-100 animate-pulse rounded-md"
          >
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 items-center">
      <div className="flex items-center justify-between gap-2 px-8 py-8 border-2 border-white hover:shadow-lg hover:shadow-chart-1/70 transition-shadow duration-300 bg-chart-1/70 rounded-s-md">
        <span className="text-base font-medium text-white">
          {stats.totalReviews.toLocaleString()} Total
        </span>
        <MessageSquare className="w-4 h-4 text-white" />
      </div>

      <div className="flex items-center justify-between gap-2 px-8 py-8 border-y-2 border-white hover:shadow-lg hover:shadow-chart-3/70 transition-shadow duration-300 bg-chart-3/70 rounded-none">
        <span className="text-base font-medium text-amber-700">
          {stats.pendingReplies.toLocaleString()} Pending
        </span>
        <Clock className="w-4 h-4 text-amber-600" />
      </div>

      <div className="flex items-center justify-between gap-2 px-8 py-8 border-2 border-white hover:shadow-lg hover:shadow-chart-4/70 transition-shadow duration-300 text-base bg-chart-4/90 rounded-e-md">
        <span className="font-medium text-emerald-700">
          {isNaN(stats.averageRating) ? '0.0' : stats.averageRating.toFixed(1)} Avg
        </span>
        <Star className="w-4 h-4 text-primary fill-primary" />
      </div>
    </div>
  );
}
