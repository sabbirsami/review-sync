'use client';

import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  MessageCircle,
  RefreshCw,
  Star,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
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
  ratingDistribution: Array<{ rating: number; count: number }>;
  lastUpdated: Date;
  monthlyGrowth: number;
  responseTimeAvg: number;
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

const COLORS = ['#1e40af', '#059669', '#d97706', '#dc2626', '#7c3aed'];

export default function ProfessionalDashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileStats[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

      const reviewsResponse = await fetch('/api/reviews?limit=5');
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
        className={`w-4 h-4 ${i < numRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse"></div>
            <RefreshCw className="w-10 h-10 animate-spin absolute top-5 left-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Gathering your business insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-10 shadow-2xl border border-red-100 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Connection Error</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-10 shadow-2xl max-w-md w-full">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No Data Available</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Start collecting reviews to see your analytics dashboard.
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile-First Professional Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-200/50 shadow-sm">
        <div className="w-full px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Business Analytics</h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>Last updated: {new Date(dashboardStats.lastUpdated).toLocaleString()}</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live data</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 bg-white shadow-sm font-medium"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-all disabled:opacity-50 font-medium shadow-sm"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 sm:px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-medium">
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Export Report</span>
                  <span className="sm:hidden">Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-2 lg:px-4 py-4 sm:py-2 lg:py-4 space-y-6 sm:space-y-4">
        {/* Responsive Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">
                    Total Reviews
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {dashboardStats.totalReviews.toLocaleString()}
                  </p>
                  {dashboardStats.monthlyGrowth > 0 && (
                    <div className="flex items-center text-emerald-600 text-sm font-medium">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+{dashboardStats.monthlyGrowth}%</span>
                    </div>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Lifetime collection</p>
              </div>
              <div className="p-3 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
                <MessageCircle className="w-5 sm:w-5 h-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">
                    Pending Responses
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {dashboardStats.pendingReplies}
                  </p>
                  {dashboardStats.pendingReplies === 0 && (
                    <div className="flex items-center text-emerald-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="hidden sm:inline">All clear!</span>
                      <span className="sm:hidden">Clear!</span>
                    </div>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  {dashboardStats.pendingReplies > 0 ? 'Requires attention' : 'Excellent work!'}
                </p>
              </div>
              <div className="p-3 sm:p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
                <Clock className="w-5 sm:w-5 h-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">
                    Average Rating
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {dashboardStats.averageRating.toFixed(1)}
                  </p>
                  <div className="flex">
                    {getRatingStars(Math.floor(dashboardStats.averageRating))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Customer satisfaction</p>
              </div>
              <div className="p-3 sm:p-2 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
                <Star className="w-5 sm:w-5 h-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">
                    Response Rate
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {dashboardStats.responseRate.toFixed(1)}%
                  </p>
                  <div className="flex items-center text-emerald-600 text-sm font-medium">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${dashboardStats.responseRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="p-3 sm:p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
                <TrendingUp className="w-5 sm:w-5 h-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Analytics Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-4">
          {/* Review Trends Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Review Trends</h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Monthly review volume and average rating performance
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 font-medium">Reviews</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-600 font-medium">Rating</span>
                </div>
              </div>
            </div>
            {dashboardStats.reviewTrends.length > 0 ? (
              <div className="w-full overflow-hidden">
                <ResponsiveContainer width="100%" height={300} className="sm:!h-[350px]">
                  <AreaChart data={dashboardStats.reviewTrends}>
                    <defs>
                      <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      stroke="#64748b"
                      fontSize={10}
                      fontWeight={500}
                      axisLine={false}
                      tickLine={false}
                      className="sm:text-xs"
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={10}
                      fontWeight={500}
                      axisLine={false}
                      tickLine={false}
                      className="sm:text-xs"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorReviews)"
                      strokeWidth={2}
                      name="Reviews"
                      className="sm:stroke-[3px]"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] sm:h-[350px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base sm:text-lg font-medium">No trend data available</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Data will appear as reviews are collected
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-6 border border-gray-100">
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Rating Distribution</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Customer rating breakdown</p>
            </div>
            {dashboardStats.ratingDistribution.length > 0 ? (
              <div className="space-y-4 sm:space-y-5">
                {dashboardStats.ratingDistribution
                  .sort((a, b) => b.rating - a.rating)
                  .map((item) => {
                    const percentage =
                      dashboardStats.totalReviews > 0
                        ? (item.count / dashboardStats.totalReviews) * 100
                        : 0;
                    return (
                      <div key={item.rating} className="group">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-sm font-bold text-gray-900 w-4">
                              {item.rating}
                            </span>
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-sm font-semibold text-gray-900">
                              {item.count}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-700 group-hover:from-blue-600 group-hover:to-blue-700"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="h-[200px] sm:h-[250px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Star className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base sm:text-lg font-medium">No rating data</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Ratings will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Responsive Location Performance */}
        {profileStats.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-100">
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Location Performance</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Compare metrics across all business locations
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {profileStats.map((profile) => (
                <div
                  key={profile.profileId}
                  className="group border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50"
                >
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg flex-shrink-0">
                        <Building2 className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                          {profile.profileName}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium truncate">
                          ID: {profile.profileId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {profile.growth > 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-bold ${
                          profile.growth > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {profile.growth > 0 ? '+' : ''}
                        {profile.growth}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Total Reviews</span>
                      <span className="font-bold text-gray-900 text-base sm:text-lg">
                        {profile.totalReviews}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Average Rating</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-base sm:text-lg">
                          {profile.averageRating.toFixed(1)}
                        </span>
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Response Rate</span>
                      <span className="font-bold text-gray-900 text-base sm:text-lg">
                        {profile.responseRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Pending</span>
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                          profile.pendingReplies > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {profile.pendingReplies}
                      </span>
                    </div>
                    <div className="pt-2 sm:pt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-700"
                          style={{ width: `${profile.responseRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Responsive Recent Reviews Activity */}
        {recentReviews.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-100">
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Recent Activity</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Latest customer reviews and business responses
              </p>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {recentReviews.map((review) => (
                <div
                  key={review.reviewId}
                  className="group border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 bg-gradient-to-r from-white to-gray-50/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      {review.reviewer.profilePhotoUrl ? (
                        <img
                          src={review.reviewer.profilePhotoUrl || '/placeholder.svg'}
                          alt={review.reviewer.displayName}
                          className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover ring-2 ring-white shadow-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                          {getInitials(review.reviewer.displayName)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                          {review.reviewer.displayName}
                        </h4>
                        <p className="text-sm text-gray-600 font-medium truncate">
                          {review.businessProfileName}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex">{getRatingStars(review.starRating)}</div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(
                          review.replyStatus,
                        )}`}
                      >
                        {getStatusIcon(review.replyStatus)}
                        <span className="capitalize">{review.replyStatus}</span>
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-800 text-sm leading-relaxed line-clamp-3">
                      {review.comment}
                    </p>
                    <p className="text-xs text-gray-500 mt-3 flex items-center gap-2 font-medium">
                      <Calendar className="w-3 h-3" />
                      {formatTimeAgo(review.createTime)}
                    </p>
                  </div>
                  {review.reviewReply && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-2 border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-bold text-blue-800 flex items-center gap-1.5">
                          {review.reviewReply.aiGenerated ? (
                            <>
                              <Zap className="w-3 h-3" />
                              <span className="hidden sm:inline">AI Generated Reply</span>
                              <span className="sm:hidden">AI Reply</span>
                            </>
                          ) : (
                            'Business Reply'
                          )}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                        {review.reviewReply.comment}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
