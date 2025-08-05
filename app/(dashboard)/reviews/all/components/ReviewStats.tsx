import { ReviewDocument } from '@/types/review';
import { Clock, MessageSquare, Star } from 'lucide-react';

export default function ReviewStats({
  reviews,
  searchTerm,
  filterStatus,
  filterRating,
  filterProfile,
}: {
  reviews: ReviewDocument[];
  searchTerm: string;
  filterStatus: string;
  filterRating: string;
  filterProfile: string;
}) {
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.businessProfileName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || review.replyStatus === filterStatus;
    const matchesRating = filterRating === 'all' || review.starRating === filterRating;
    const matchesProfile = filterProfile === 'all' || review.businessProfileName === filterProfile;
    return matchesSearch && matchesStatus && matchesRating && matchesProfile;
  });

  const totalReviews = filteredReviews.length;
  const pendingReviews = filteredReviews.filter((r) => r.replyStatus === 'pending').length;
  const avgRating =
    filteredReviews.reduce((acc, r) => {
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
    }, 0) / totalReviews;

  return (
    <div className="grid grid-cols-3 items-center">
      <div className="flex items-center justify-between gap-2 px-8 py-8 border-2 border-white hover:shadow-lg hover:shadow-chart-1/70 transition-shadow duration-300 bg-chart-1/70 rounded-s-md">
        <span className="text-base font-medium text-white">{totalReviews} Total</span>
        <MessageSquare className="w-4 h-4 text-white" />
      </div>
      <div className="flex items-center justify-between gap-2 px-8 py-8 border-y-2 border-white hover:shadow-lg hover:shadow-chart-3/70 transition-shadow duration-300 bg-chart-3/70 rounded-none">
        <span className="text-base font-medium text-amber-700">{pendingReviews} Pending</span>
        <Clock className="w-4 h-4 text-amber-600" />
      </div>
      <div className="flex items-center justify-between gap-2 px-8 py-8 border-2 border-white hover:shadow-lg hover:shadow-chart-4/70 transition-shadow duration-300 text-base bg-chart-4/90 rounded-e-md">
        <span className="font-medium text-emerald-700">
          {isNaN(avgRating) ? '0.0' : avgRating.toFixed(1)} Avg
        </span>
        <Star className="w-4 h-4 text-primary fill-primary" />
      </div>
    </div>
  );
}
