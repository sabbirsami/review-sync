'use client';

import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  MessageCircle,
  RefreshCw,
  Star,
  TrendingUp,
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

// Types based on your actual data structure
interface DashboardStats {
  totalReviews: number;
  pendingReplies: number;
  averageRating: number;
  responseRate: number;
  reviewTrends: Array<{ month: string; count: number }>;
  ratingDistribution: Array<{ rating: number; count: number }>;
  lastUpdated: Date;
}

interface ProfileStats {
  profileId: string;
  profileName: string;
  totalReviews: number;
  averageRating: number;
  pendingReplies: number;
  responseRate: number;
  lastReviewDate: string;
}

interface Review {
  _id?: string;
  reviewId: string;
  businessProfileId?: string;
  businessProfileName?: string;
  reviewer: {
    profilePhotoUrl: string;
    displayName: string;
  };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
    aiGenerated?: boolean;
  };
  replyStatus: 'pending' | 'replied' | 'ignored';
  sentimentScore?: number;
  responseTimeHours?: number;
  name: string;
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'];

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

      // Fetch dashboard stats and profile stats
      const statsResponse = await fetch('/api/stats');
      if (!statsResponse.ok) {
        throw new Error(`Failed to fetch stats: ${statsResponse.status}`);
      }
      const statsData = await statsResponse.json();

      if (statsData.dashboardStats) {
        setDashboardStats(statsData.dashboardStats);
        setProfileStats(statsData.profileStats || []);
      }

      // Fetch recent reviews
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
        className={`w-4 h-4 ${i < numRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ignored':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600 mb-4">No reviews found in your database.</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Review Analytics</h1>
              <p className="text-sm text-gray-600 mt-1">
                Monitor and manage your customer reviews across all locations
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {new Date(dashboardStats.lastUpdated).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardStats.totalReviews.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600 mt-1">All time</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Replies</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardStats.pendingReplies}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  {dashboardStats.pendingReplies > 0 ? 'Needs attention' : 'All caught up!'}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardStats.averageRating.toFixed(1)}
                  </p>
                  <div className="flex">
                    {getRatingStars(Math.floor(dashboardStats.averageRating))}
                  </div>
                </div>
                <p className="text-sm text-green-600 mt-1">Overall rating</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardStats.responseRate.toFixed(1)}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dashboardStats.responseRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Review Trends */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Review Trends</h3>
              <p className="text-sm text-gray-600">Monthly review volume over time</p>
            </div>
            {dashboardStats.reviewTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardStats.reviewTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    name="Reviews"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No trend data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Rating Distribution</h3>
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
                      <div key={item.rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                          <span className="text-sm font-medium">{item.rating}</span>
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 w-12 text-right">{item.count}</div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No rating data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Business Profiles Overview */}
        {profileStats.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Business Profiles</h3>
              <p className="text-sm text-gray-600">Performance across all locations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profileStats.map((profile) => (
                <div
                  key={profile.profileId}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900">{profile.profileName}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        profile.pendingReplies > 0
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {profile.pendingReplies} pending
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Reviews</span>
                      <span className="font-medium">{profile.totalReviews}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{profile.averageRating.toFixed(1)}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Response Rate</span>
                      <span className="font-medium">{profile.responseRate.toFixed(1)}%</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${profile.responseRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Reviews */}
        {recentReviews.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
              <p className="text-sm text-gray-600">Latest customer feedback</p>
            </div>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.reviewId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {review.reviewer.profilePhotoUrl ? (
                        <img
                          src={review.reviewer.profilePhotoUrl}
                          alt={review.reviewer.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                          {getInitials(review.reviewer.displayName)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{review.reviewer.displayName}</h4>
                        <p className="text-sm text-gray-600">{review.businessProfileName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">{getRatingStars(review.starRating)}</div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                          review.replyStatus,
                        )}`}
                      >
                        {getStatusIcon(review.replyStatus)}
                        <span className="capitalize">{review.replyStatus}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-800 text-sm leading-relaxed">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(review.createTime)}</p>
                  </div>

                  {review.reviewReply && (
                    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          {review.reviewReply.aiGenerated ? 'AI Generated Reply' : 'Business Reply'}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {review.reviewReply.comment}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Replied {formatTimeAgo(review.reviewReply.updateTime)}
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
