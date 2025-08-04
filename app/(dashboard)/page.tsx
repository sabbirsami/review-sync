'use client';

import Header from '@/components/share/header/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Eye,
  MessageCircle,
  MoreHorizontal,
  RefreshCw,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DashboardStats {
  totalReviews: number;
  pendingReplies: number;
  averageRating: number;
  responseRate: number;
  reviewTrends: Array<{ month: string; count: number; rating: number }>;
  reviewTrends3Months: Array<{ month: string; count: number; rating: number }>;
  reviewTrends30Days: Array<{ day: string; count: number; rating: number }>;
  reviewTrends7Days: Array<{ day: string; count: number; rating: number }>;
  ratingDistribution: Array<{ rating: number; count: number }>;
  lastUpdated: Date;
  monthlyGrowth: number;
  responseTimeAvg: number;
  responseTrends: Array<{ month: string; responseTime: number; replyRate: number }>;
}

interface ProfileStats {
  profileId: string;
  profileName: string;
  totalReviews: number;
  averageRating: number;
  pendingReplies: number;
  responseRate: number;
  lastReviewDate: string;
  growth: number;
}

interface Review {
  reviewId: string;
  businessProfileName?: string;
  reviewer: {
    profilePhotoUrl: string;
    displayName: string;
  };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
    aiGenerated?: boolean;
  };
  replyStatus: 'pending' | 'replied' | 'ignored';
  sentimentScore?: number;
}

const COLORS = ['#0B5C58', '#1B5551', '#FBD686', '#A8D5D1', '#F7F4E9'];

export default function ProfessionalDashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileStats[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Value comparison');
  const [selectedTimeframe, setSelectedTimeframe] = useState('12 Months');

  // New state for review card expansion
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    try {
      setError(null);
      const statsResponse = await fetch('/api/stats');
      if (!statsResponse.ok) {
        throw new Error(`Failed to fetch stats: ${statsResponse.status}`);
      }
      const statsData = await statsResponse.json();
      if (statsData.dashboardStats) {
        setDashboardStats(statsData.dashboardStats);
        setProfileStats(statsData.profileStats || []);
      }

      const reviewsResponse = await fetch('/api/reviews?limit=4');
      if (!reviewsResponse.ok) {
        throw new Error(`Failed to fetch reviews: ${reviewsResponse.status}`);
      }
      const reviewsData = await reviewsResponse.json();
      if (reviewsData.reviews) {
        setRecentReviews(reviewsData.reviews);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toggle functions for review cards
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

  const getChartData = () => {
    if (!dashboardStats) return [];
    switch (selectedTimeframe) {
      case '7 Days':
        return dashboardStats.reviewTrends7Days || [];
      case '30 Days':
        return dashboardStats.reviewTrends30Days || [];
      case '3 Months':
        return dashboardStats.reviewTrends3Months || [];
      case '12 Months':
      default:
        return dashboardStats.reviewTrends || [];
    }
  };

  const getChartDataKey = () => {
    return selectedTimeframe === '7 Days' || selectedTimeframe === '30 Days' ? 'day' : 'month';
  };

  const getRatingStars = (rating: string | number) => {
    const numRating =
      typeof rating === 'string'
        ? rating === 'ONE'
          ? 1
          : rating === 'TWO'
          ? 2
          : rating === 'THREE'
          ? 3
          : rating === 'FOUR'
          ? 4
          : 5
        : rating;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < numRating ? 'fill-[#FBD686] text-[#FBD686]' : 'text-gray-300'}`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
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
        return <CheckCircle2 className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'ignored':
        return <Eye className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  // Review card render function from the first snippet
  const renderReviewCard = (review: Review) => (
    <Card
      key={review.reviewId}
      className="border-2 border-[#D1D9D8] bg-white flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <CardContent className="px-6 flex flex-col">
        {/* Header Section */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between gap-4 mb-3">
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
          <h5 className="font-semibold text-[#1B5551] text-sm mb-0.5">Customer Review</h5>
          <div className="bg-[#F0EDE0]/60 rounded-sm px-2 pt-1 pb-2 border border-[#D1D9D8]/30 mb-4 backdrop-blur-sm">
            <div className="relative">
              <p
                className={`text-[#1B5551] leading-relaxed text-sm transition-all duration-300 ${
                  expandedReviews[review.reviewId] ? '' : 'line-clamp-3'
                }`}
              >
                {review.comment ? review.comment : 'No comment'}
              </p>
              {review?.comment && review.comment.length > 150 && (
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
          <div className="mt-auto">
            {review.reviewReply ? (
              <div className="space-y-2">
                <button
                  onClick={() => toggleReplyExpand(review.reviewId)}
                  className="w-full text-left group"
                >
                  <div className="flex items-center justify-between transition-colors">
                    <div className="flex items-center text-sm text-[#0B5C58] font-medium">
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
                    <p className="text-[#1B5551] leading-relaxed text-sm">
                      {review.reviewReply.comment.length > 100
                        ? `${review.reviewReply.comment.slice(0, 100)}...`
                        : review.reviewReply.comment}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-400">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">
                      ⏳ Awaiting Response
                    </span>
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
            <RefreshCw className="w-10 h-10 animate-spin absolute top-5 left-5 text-[#0B5C58]" />
          </div>
          <h2 className="text-xl font-semibold text-[#1B5551] mb-2">Loading Dashboard</h2>
          <p className="text-[#1B5551]/70">Gathering your business insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F4E9] flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-10 shadow-2xl border border-red-100 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1B5551] mb-3">Connection Error</h2>
          <p className="text-[#1B5551]/70 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#0B5C58] to-[#1B5551] text-white rounded-xl hover:from-[#1B5551] hover:to-[#0B5C58] transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardStats) {
    return (
      <div className="min-h-screen bg-[#F7F4E9] flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-10 shadow-2xl max-w-md w-full">
          <div className="w-16 h-16 bg-[#F0EDE0] rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-8 h-8 text-[#1B5551]/60" />
          </div>
          <h2 className="text-2xl font-bold text-[#1B5551] mb-3">No Data Available</h2>
          <p className="text-[#1B5551]/70 mb-8 leading-relaxed">
            Start collecting reviews to see your analytics dashboard.
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#0B5C58] to-[#1B5551] text-white rounded-xl hover:from-[#1B5551] hover:to-[#0B5C58] transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4E9] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-primary pt-4">
        <Header title={'Business Analytics'} />
        {/* Tabs */}
        <div className="px-6 sticky top-0 bg-white">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="sticky top-[68px] bg-white z-10"
          >
            <TabsList className="bg-white p-0 h-auto">
              {['Value comparison', 'Average values', 'Configure analysis', 'Filter analysis'].map(
                (tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`py-3.5 px-0 mr-8 text-sm font-medium border-b-4 border-t-0 border-x-0 data-[state=active]:bg-white bg-white rounded-none data-[state=active]:shadow-none ${
                      activeTab === tab
                        ? 'border-[#0B5C58] text-[#0B5C58] bg-white'
                        : 'border-transparent text-[#1B5551]/60 hover:text-[#1B5551]'
                    }`}
                  >
                    {tab}
                  </TabsTrigger>
                ),
              )}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="border-2 border-white shadow-lg shadow-chart-1/70 bg-chart-1/90 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Total Reviews</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {dashboardStats.totalReviews.toLocaleString()}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  {dashboardStats.monthlyGrowth > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">
                        +{dashboardStats.monthlyGrowth}% this month
                      </span>
                    </>
                  ) : (
                    <span className="text-white/60">No growth data</span>
                  )}
                </div>
              </div>
              <div className="w-16 h-12 rounded flex items-end justify-center">
                <div className="flex space-x-1 items-end">
                  <div className="w-1 h-4 bg-chart-3 rounded-sm"></div>
                  <div className="w-1 h-6 bg-chart-3 rounded-sm"></div>
                  <div className="w-1 h-3 bg-chart-3 rounded-sm"></div>
                  <div className="w-1 h-8 bg-chart-3 rounded-sm"></div>
                  <div className="w-1 h-5 bg-chart-3 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border-white shadow-lg shadow-chart-3/70 bg-chart-3/90 p-6 border-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-900">Pending Responses</p>
                <p className="text-3xl font-bold text-amber-900 mt-1">
                  {dashboardStats.pendingReplies}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  {dashboardStats.pendingReplies === 0 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">All clear!</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-amber-900 mr-1" />
                      <span className="text-amber-900">Requires attention</span>
                    </>
                  )}
                </div>
              </div>
              <div className="w-16 h-12 rounded flex items-end justify-center">
                <div className="flex space-x-1 items-end">
                  <div className="w-1 h-6 bg-black rounded-sm"></div>
                  <div className="w-1 h-4 bg-black rounded-sm"></div>
                  <div className="w-1 h-7 bg-black rounded-sm"></div>
                  <div className="w-1 h-3 bg-black rounded-sm"></div>
                  <div className="w-1 h-5 bg-black rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg p-6 bg-chart-4/90 border-2 border-white shadow-lg shadow-chart-4/70">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-chart-1">Average Rating</p>
                <p className="text-3xl font-bold text-[#1B5551] mt-1">
                  {dashboardStats.averageRating.toFixed(1)}
                </p>
                <div className="flex items-center mt-2">
                  {getRatingStars(Math.floor(dashboardStats.averageRating))}
                </div>
              </div>
              <div className="w-16 h-12 rounded flex items-end justify-center">
                <div className="flex space-x-1 items-end">
                  <div className="w-1 h-5 bg-chart-1 rounded-sm"></div>
                  <div className="w-1 h-7 bg-chart-1 rounded-sm"></div>
                  <div className="w-1 h-4 bg-chart-1 rounded-sm"></div>
                  <div className="w-1 h-6 bg-chart-1 rounded-sm"></div>
                  <div className="w-1 h-8 bg-chart-1 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Review Trends Bar Chart */}
          <div className="col-span-2 bg-white rounded-lg p-6 shadow-lg border-2 border-chart-1/80 shadow-chart-1/15">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#1B5551]">Review Trends</h3>
              <div className="flex space-x-2">
                {['12 Months', '3 Months', '30 Days', '7 Days'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedTimeframe(period)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                      selectedTimeframe === period
                        ? 'bg-[#0B5C58] text-white shadow-md'
                        : 'text-[#1B5551]/70 hover:bg-[#F0EDE0] hover:text-[#1B5551]'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            {getChartData().length > 0 ? (
              <div className="w-full overflow-hidden">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D1D9D8" />
                    <XAxis
                      dataKey={getChartDataKey()}
                      stroke="#1B5551"
                      fontSize={10}
                      fontWeight={500}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#1B5551"
                      fontSize={10}
                      fontWeight={500}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #D1D9D8',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#1B5551',
                      }}
                    />
                    <Bar dataKey="count" fill="#0B5C58" radius={[4, 4, 0, 0]} name="Reviews" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center border- border-chart-1/80 shadow-chart-1/15 text-[#1B5551]/60">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-[#1B5551]/30" />
                  <p className="text-base font-medium">No trend data available</p>
                  <p className="text-xs text-[#1B5551]/40 mt-1">
                    Data will appear as reviews are collected
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-chart-1/80 shadow-chart-1/15">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-lg font-semibold text-[#1B5551]">Rating Distribution</h3>
              <MoreHorizontal className="w-5 h-5 text-[#1B5551]/40" />
            </div>
            {dashboardStats.ratingDistribution.length > 0 ? (
              <div className="space-y-4">
                {dashboardStats.ratingDistribution
                  .sort((a, b) => b.rating - a.rating)
                  .map((item) => {
                    const percentage =
                      dashboardStats.totalReviews > 0
                        ? (item.count / dashboardStats.totalReviews) * 100
                        : 0;
                    return (
                      <div key={item.rating} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#1B5551] w-4">
                              {item.rating}
                            </span>
                            <Star className="w-4 h-4 fill-[#FBD686] text-[#FBD686]" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#1B5551]">
                              {item.count}
                            </span>
                            <span className="text-xs text-[#1B5551]/60 font-medium">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-[#F0EDE0] rounded-md h-10">
                          <div
                            className="bg-gradient-to-r from-[#0B5C58] to-[#1B5551] h-10 rounded-md transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center border- border-chart-1/80 shadow-chart-1/15 text-[#1B5551]/60">
                <div className="text-center">
                  <Star className="w-12 h-12 mx-auto mb-4 text-[#1B5551]/30" />
                  <p className="text-base font-medium">No rating data</p>
                  <p className="text-xs text-[#1B5551]/40 mt-1">Ratings will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Response Trends Area Chart */}
        <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-chart-1/80 shadow-chart-1/15">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#1B5551]">Response Performance</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 rounded text-sm bg-[#0B5C58] text-white font-medium">
                Response Time
              </button>
              <button className="px-3 py-1 rounded text-sm text-[#1B5551]/70 hover:bg-[#F0EDE0] font-medium">
                Reply Rate
              </button>
            </div>
          </div>
          {dashboardStats.responseTrends?.length > 0 ? (
            <div className="w-full overflow-hidden">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardStats.responseTrends}>
                  <defs>
                    <linearGradient id="colorResponseTime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B5C58" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0B5C58" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D1D9D8" />
                  <XAxis
                    dataKey="month"
                    stroke="#1B5551"
                    fontSize={10}
                    fontWeight={500}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#1B5551"
                    fontSize={10}
                    fontWeight={500}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #D1D9D8',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#1B5551',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="responseTime"
                    stroke="#0B5C58"
                    fillOpacity={1}
                    fill="url(#colorResponseTime)"
                    strokeWidth={2}
                    name="Response Time (hours)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center border- border-chart-1/80 shadow-chart-1/15 text-[#1B5551]/60">
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-[#1B5551]/30" />
                <p className="text-base font-medium">No response data available</p>
                <p className="text-xs text-[#1B5551]/40 mt-1">
                  Data will appear as responses are tracked
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Reviews with Card Design - 2 Column Grid */}
          <div className="col-span-2 pt-2">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-lg font-semibold text-[#1B5551] ">Recent Activity</h3>
              <div className="flex space-x-2">
                <Download className="w-5 h-5 text-[#1B5551]/40 cursor-pointer hover:text-[#1B5551]" />
                <MoreHorizontal className="w-5 h-5 text-[#1B5551]/40 cursor-pointer hover:text-[#1B5551]" />
              </div>
            </div>
            {recentReviews.length > 0 ? (
              <div className="pb-10">
                <div className="grid grid-cols-2 gap-4">
                  {recentReviews.map((review) => renderReviewCard(review))}
                </div>
                <div className="flex items-center justify-center mt-6">
                  <Link
                    href="/reviews/all"
                    className="rounded-full bg-primary px-10 py-3 text-center mx-auto text-white hover:shadow-xl hover:shadow-primary/15 "
                  >
                    <span className="">View All Reviews</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center border- border-chart-1/80 shadow-chart-1/15 text-[#1B5551]/60">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-[#1B5551]/30" />
                  <p className="text-base font-medium">No recent reviews</p>
                  <p className="text-xs text-[#1B5551]/40 mt-1">Reviews will appear here</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Response Rate */}
            <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-chart-1/80 shadow-chart-1/15">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1B5551]">Response Rate</h3>
                <select className="text-sm border border-[#D1D9D8] rounded px-2 py-1 text-[#1B5551]/70 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5C58]">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last year</option>
                </select>
              </div>
              <div className="text-2xl font-bold text-[#1B5551]">
                {dashboardStats.responseRate.toFixed(1)}%
              </div>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-sm">+{dashboardStats.monthlyGrowth}%</span>
                <span className="ml-2 bg-[#0B5C58] text-white text-xs px-2 py-1 rounded">
                  Target 90%
                </span>
              </div>
              {/* Mini line chart representation */}
              <div className="mt-4 h-16 flex items-end space-x-1">
                {[20, 35, 25, 45, 30, 50, 40, 60, 45, 55, 35, 50].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#0B5C58] rounded-sm"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Location Performance */}
            {profileStats.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-chart-1/80 shadow-chart-1/15">
                <h3 className="text-lg font-semibold text-[#1B5551] mb-2">Location Performance</h3>
                <p className="text-sm text-[#1B5551]/70 mb-4">Compare metrics across locations</p>
                <div className="flex items-center space-x-2 mb-4">
                  {profileStats.slice(0, 3).map((profile, index) => (
                    <div
                      key={profile.profileId}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      {getInitials(profile.profileName)}
                    </div>
                  ))}
                  {profileStats.length > 3 && (
                    <div className="w-8 h-8 bg-[#F0EDE0] rounded-full flex items-center justify-center text-[#1B5551]/70 text-xs font-medium">
                      +{profileStats.length - 3}
                    </div>
                  )}
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-center space-x-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                    <button
                      key={num}
                      className={`w-6 h-6 text-xs rounded font-medium ${
                        num === 1
                          ? 'bg-[#0B5C58] text-white'
                          : 'text-[#1B5551]/70 hover:bg-[#F0EDE0]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
