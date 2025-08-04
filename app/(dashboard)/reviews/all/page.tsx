'use client';

import Header from '@/components/share/header/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Eye,
  MessageSquare,
  RefreshCw,
  Search,
  Sparkles,
  Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Review {
  reviewId: string;
  businessProfileName: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl: string;
  };
  starRating: string;
  comment: string;
  createTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
    aiGenerated?: boolean;
  };
  replyStatus: string;
  sentimentScore?: number;
}

export default function AllReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [filterProfile, setFilterProfile] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '100',
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterRating !== 'all' && { rating: filterRating }),
        ...(filterProfile !== 'all' && { profileId: filterProfile }),
      });
      const response = await fetch(`/api/reviews?${params}`);
      const data = await response.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filterStatus, filterRating, filterProfile]);

  const toggleReviewExpand = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const toggleReplyExpand = (reviewId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'replied':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ignored':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'replied':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'pending':
        return <Clock className="w-3.5 h-3.5" />;
      case 'ignored':
        return <AlertCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const getRatingStars = (rating: string) => {
    const numRating =
      rating === 'ONE'
        ? 1
        : rating === 'TWO'
        ? 2
        : rating === 'THREE'
        ? 3
        : rating === 'FOUR'
        ? 4
        : 5;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < numRating ? 'fill-[#FBD686] text-[#FBD686]' : 'text-[#D1D9D8]'}`}
      />
    ));
  };

  const getSentimentColor = (score?: number) => {
    if (!score) return 'bg-[#F0EDE0] text-[#1B5551]';
    if (score >= 0.7) return 'bg-emerald-100 text-emerald-700';
    if (score >= 0.4) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const getSentimentLabel = (score?: number) => {
    if (!score) return 'Unknown';
    if (score >= 0.7) return 'Positive';
    if (score >= 0.4) return 'Neutral';
    return 'Negative';
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.businessProfileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || review.replyStatus === filterStatus;
    const matchesRating = filterRating === 'all' || review.starRating === filterRating;
    const matchesProfile = filterProfile === 'all' || review.businessProfileName === filterProfile;
    return matchesSearch && matchesStatus && matchesRating && matchesProfile;
  });

  const uniqueProfiles = Array.from(new Set(reviews.map((review) => review.businessProfileName)));

  // Quick stats for the header
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

  const renderReviewCard = (review: Review) => (
    <Card
      key={review.reviewId}
      className="border-2 border-[#D1D9D8] bg-white flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <CardContent className="px-6 flex flex-col">
        {/* Header Section */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={review.reviewer.profilePhotoUrl || '/placeholder.svg'}
                  alt={review.reviewer.displayName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-md"
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-[#1B5551] text-sm">
                  {review.reviewer.displayName.length > 20
                    ? `${review.reviewer.displayName.slice(0, 20)}...`
                    : review.reviewer.displayName}
                </h4>
                <div className="flex items-center gap-2 -mt-1 text-xs text-[#1B5551]/60">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(review.createTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-0.5">{getRatingStars(review.starRating)}</div>
          </div>
        </div>
        {/* Review Content */}
        <div className="flex-grow flex flex-col">
          {/* <h5 className="font-semibold text-[#1B5551] text-sm mb-0.5">Customer Review</h5> */}
          <div className="bg-[#F0EDE0]/0 rounded-sm  mb-3 backdrop-blur-sm">
            <div className="relative">
              <p
                className={`text-[#1B5551] leading-relaxed text-sm transition-all duration-300 ${
                  expandedReviews[review.reviewId] ? '' : 'line-clamp-3'
                }`}
              >
                {review.comment ? review.comment : 'No comment'}
              </p>
              {review?.comment?.length > 150 && (
                <button
                  onClick={() => toggleReviewExpand(review.reviewId)}
                  className="mt-2 text-sm text-[#0B5C58] font-medium flex items-center hover:text-[#1B5551] transition-colors"
                >
                  {expandedReviews[review.reviewId] ? (
                    <>
                      <span>Show less</span>
                      <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      <span>Read more</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          {/* Action Section */}
          <div className="pt-2 text-xs border-t border-background">
            {review.reviewReply ? (
              <div className="space-y-2">
                <button
                  onClick={() => toggleReplyExpand(review.reviewId)}
                  className="w-full text-left group"
                >
                  <div className="flex items-center justify-between  transition-colors">
                    <div className="flex items-center text-xs text-[#0B5C58] font-medium">
                      <span>{review.reviewReply.aiGenerated ? '✨ AI Reply' : 'Show Reply'}</span>
                    </div>
                    {expandedReplies[review.reviewId] ? (
                      <ChevronUp className="w-4 h-4 text-[#0B5C58]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#0B5C58]" />
                    )}
                  </div>
                </button>
                {expandedReplies[review.reviewId] && (
                  <div className="bg-gradient-to-br from-[#0B5C58]/5 to-[#0B5C58]/10 rounded-md p-4 border-l-4 border-[#0B5C58] backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-[#1B5551]/60">
                        {new Date(review.reviewReply.updateTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[#1B5551] leading-relaxed text-xs">
                      {review.reviewReply.comment.length > 100
                        ? `${review.reviewReply.comment.slice(0, 100)}...`
                        : review.reviewReply.comment}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-sm p-4 border-l-4 border-amber-400">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">Awaiting Response</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-[#D1D9D8] hover:bg-gray-50 flex-1 bg-transparent"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Mark Read
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#0B5C58] to-[#1B5551] hover:from-[#1B5551] hover:to-[#0B5C58] text-white text-xs flex-1 shadow-lg"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4E9] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-[#0B5C58]/20 animate-pulse"></div>
            <RefreshCw className="w-10 h-10 animate-spin absolute top-4 left-4 text-[#0B5C58]" />
          </div>
          <h2 className="text-xl font-semibold text-[#1B5551] mb-2">Loading Reviews</h2>
          <p className="text-[#1B5551]/70">Gathering your customer feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4E9] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-primary pt-4">
        <Header title={'Review Management'} />
        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 bg-white md:grid-cols-2 lg:grid-cols-8 gap-4 py-3 px-6">
          <div className="relative group col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1B5551]/60 w-4 h-4 group-focus-within:text-[#0B5C58]" />
            <Input
              placeholder="Search reviews, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-none shadow-none focus:border-[#0B5C58] focus:ring-[#0B5C58]/20 bg-background"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
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
          <Select value={filterRating} onValueChange={setFilterRating}>
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
          <Select value={filterProfile} onValueChange={setFilterProfile}>
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
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterRating('all');
              setFilterProfile('all');
            }}
            className="border-none shadow-none w-full bg-white hover:bg-red-700 hover:border-red-300 hover:shadow-lg shadow-red-700/70 hover:text-white"
          >
            Clear All
          </Button>
          <div className="flex w-full items-center gap-3 col-span-2 ms-2 border-s ps-6">
            <Button
              variant="outline"
              className="bg-white hover:shadow-lg shadow-chart-3/70 border-none shadow-none w-[40%]"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={fetchReviews}
              disabled={loading}
              className="bg-gradient-to-r from-[#0B5C58] to-[#1B5551] hover:shadow-lg shadow-chart-1/70 text-white w-[50%]"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center justify-between gap-2 px-8 py-8 border-2 border-white shadow-lg shadow-chart-1/70 bg-chart-1/70 rounded-s-md">
            <span className="text-base font-medium text-white">{totalReviews} Total</span>
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center justify-between gap-2 px-8 py-8 border-y-2 border-white shadow-lg shadow-chart-3/70 bg-chart-3/70 rounded-none">
            <span className="text-base font-medium text-amber-700">{pendingReviews} Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-center justify-between gap-2 px-8 py-8 border-2 border-white shadow-lg shadow-chart-4/70 text-base bg-chart-4/90 rounded-e-md">
            <span className="font-medium text-emerald-700">
              {isNaN(avgRating) ? '0.0' : avgRating.toFixed(1)} Avg
            </span>
            <Star className="w-4 h-4 text-primary fill-primary" />
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(() => {
              const totalCardInRow = Math.ceil(filteredReviews.length / 4);
              const row1 = 0 + totalCardInRow;
              const row2 = row1 + totalCardInRow;
              const row3 = row2 + totalCardInRow;
              const row4 = row3 + totalCardInRow;

              return (
                <>
                  {/* Column 1 */}
                  <div className="grid 2xl:gap-3 gap-4">
                    {filteredReviews.slice(0, row1).map((review) => renderReviewCard(review))}
                  </div>

                  {/* Column 2 */}
                  <div className="grid 2xl:gap-3 gap-4">
                    {filteredReviews.slice(row1, row2).map((review) => renderReviewCard(review))}
                  </div>

                  {/* Column 3 */}
                  <div className="grid 2xl:gap-3 gap-4 ">
                    {filteredReviews.slice(row2, row3).map((review) => renderReviewCard(review))}
                  </div>

                  {/* Column 4 */}
                  <div className="grid 2xl:gap-3 gap-4  ">
                    {filteredReviews.slice(row3, row4).map((review) => renderReviewCard(review))}
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <Card className="border border-[#D1D9D8] bg-white">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#F0EDE0] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-[#1B5551]/40" />
                </div>
                <h3 className="text-xl font-semibold text-[#1B5551] mb-2">No reviews found</h3>
                <p className="text-[#1B5551]/70 mb-6 max-w-md mx-auto">
                  Try adjusting your search criteria or filters to find the reviews you&apos;re
                  looking for.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                    setFilterRating('all');
                    setFilterProfile('all');
                  }}
                  className="bg-gradient-to-r from-[#0B5C58] to-[#1B5551] text-white"
                >
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
