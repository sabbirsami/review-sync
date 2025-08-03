'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
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
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  MessageSquare,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  User,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'replied':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ignored':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'replied':
        return <CheckCircle className="w-3.5 h-3.5" />;
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
        className={`w-4 h-4 ${i < numRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
      />
    ));
  };

  const getSentimentColor = (score?: number) => {
    if (!score) return 'bg-slate-100 text-slate-700';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
              <RefreshCw className="w-8 h-8 animate-spin absolute top-4 left-4 text-blue-600" />
            </div>
            <p className="text-slate-600 mt-4 font-medium">Loading your reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header with Glass Effect */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg shadow-blue-500/5">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Review Management Hub
              </h1>
              <p className="text-slate-600">
                Monitor, analyze, and respond to customer feedback across all platforms
              </p>

              {/* Quick Stats Bar */}
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">{totalReviews} Total</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">
                    {pendingReviews} Pending
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium text-emerald-700">
                    {isNaN(avgRating) ? '0.0' : avgRating.toFixed(1)} Avg
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="bg-white/80">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={`bg-white/80 ${showFilters ? 'ring-2 ring-blue-500' : ''}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button
                onClick={fetchReviews}
                disabled={loading}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Enhanced Filters with Slide Animation */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showFilters
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <Card className="border-0 shadow-xl shadow-blue-500/10 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-500" />
                  <Input
                    placeholder="Search reviews, customers, locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="border-slate-200 bg-white/80">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="replied">✅ Replied</SelectItem>
                    <SelectItem value="pending">⏳ Pending</SelectItem>
                    <SelectItem value="ignored">❌ Ignored</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger className="border-slate-200 bg-white/80">
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
                  <SelectTrigger className="border-slate-200 bg-white/80">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueProfiles.map((profile) => (
                      <SelectItem key={profile} value={profile}>
                        🏢 {profile}
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
                  className="border-slate-200 bg-white/80 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm">
            Showing <span className="font-semibold text-slate-900">{filteredReviews.length}</span>{' '}
            of <span className="font-semibold text-slate-900">{reviews.length}</span> reviews
          </div>

          {filteredReviews.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <TrendingUp className="w-4 h-4" />
              <span>Updated {new Date().toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Enhanced Reviews Accordion */}
        {filteredReviews.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-4">
            {filteredReviews.map((review, index) => (
              <AccordionItem
                key={review.reviewId}
                value={review.reviewId}
                className="border-0 shadow-lg shadow-blue-500/5 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                <AccordionTrigger className="hover:no-underline px-6 py-5 group">
                  <div className="flex items-center justify-between w-full mr-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={
                            review.reviewer.profilePhotoUrl || '/placeholder.svg?height=48&width=48'
                          }
                          alt={review.reviewer.displayName}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md group-hover:ring-blue-200 transition-all duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <User className="w-2.5 h-2.5 text-slate-600" />
                        </div>
                      </div>

                      <div className="text-left space-y-1">
                        <h4 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {review.reviewer.displayName}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{review.businessProfileName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
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

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {getRatingStars(review.starRating)}
                      </div>

                      <Badge className={`${getStatusColor(review.replyStatus)} border font-medium`}>
                        {getStatusIcon(review.replyStatus)}
                        <span className="ml-1 capitalize">{review.replyStatus}</span>
                      </Badge>

                      {review.sentimentScore && (
                        <Badge
                          className={`${getSentimentColor(review.sentimentScore)} font-medium`}
                        >
                          {getSentimentLabel(review.sentimentScore)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6">
                    {/* Review Content */}
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-5 border border-slate-200/50">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 text-slate-600" />
                        <h5 className="font-semibold text-slate-900">Customer Review</h5>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-sm">{review.comment}</p>
                    </div>

                    {/* Reply Section */}
                    {review.reviewReply ? (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-l-4 border-blue-400 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-800">
                            {review.reviewReply.aiGenerated
                              ? '✨ AI Generated Reply'
                              : '👤 Manual Reply'}
                          </span>
                          <span className="text-xs text-slate-500 ml-auto">
                            {new Date(review.reviewReply.updateTime).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-sm">
                          {review.reviewReply.comment}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border-l-4 border-amber-400 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-semibold text-amber-800">
                              ⏳ Awaiting Response
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              Mark as Read
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-xs"
                            >
                              <Sparkles className="w-3 h-3 mr-1" />
                              Generate Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Card className="border-0 shadow-xl shadow-blue-500/10 bg-white/80 backdrop-blur-sm">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No reviews found</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
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
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
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
