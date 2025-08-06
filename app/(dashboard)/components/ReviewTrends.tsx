/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { BarChart3 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ReviewTrendsProps {
  dashboardStats: {
    reviewTrends?: Array<{ month: string; count: number; rating?: number }>;
    reviewTrends3Months?: Array<{ month: string; count: number; rating?: number }>;
    reviewTrends30Days?: Array<{ day: string; count: number; rating?: number }>;
    reviewTrends7Days?: Array<{ day: string; count: number; rating?: number }>;
  };
  selectedTimeframe: string;
  profileId?: string;
}

interface TrendData {
  period: string;
  count: number;
  date: string;
}

type TimeframePeriod = '12 Months' | '3 Months' | '30 Days' | '7 Days';

export default function ReviewTrends({
  dashboardStats,
  selectedTimeframe,
  profileId,
}: ReviewTrendsProps) {
  const [chartData, setChartData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTimeframe, setCurrentTimeframe] = useState<TimeframePeriod>(
    (selectedTimeframe as TimeframePeriod) || '30 Days',
  );
  const searchParams = useSearchParams();

  // Map selectedTimeframe to API period format
  const getApiPeriod = (timeframe: string): '7d' | '30d' | '3m' | '12m' => {
    switch (timeframe) {
      case '7 Days':
        return '7d';
      case '30 Days':
        return '30d';
      case '3 Months':
        return '3m';
      case '12 Months':
        return '12m';
      default:
        return '30d';
    }
  };

  // Get the appropriate data key for the chart
  const getChartDataKey = () => {
    return currentTimeframe === '7 Days' || currentTimeframe === '30 Days' ? 'day' : 'month';
  };

  // Fetch trend data from API
  const fetchTrendData = async (timeframe: string, currentProfileId: string) => {
    setLoading(true);
    setError(null);
    try {
      const period = getApiPeriod(timeframe);
      const queryParams = new URLSearchParams({ period });
      if (currentProfileId && currentProfileId !== 'all') {
        queryParams.set('profileId', currentProfileId);
      }
      const url = `/api/review-trends?${queryParams.toString()}`;
      console.log('Fetching review trends from:', url);
      const response = await fetch(url);
      const result = await response.json();

      if (result.success && result.data) {
        // Transform API data to match expected format
        const transformedData = result.data.map((item: any) => ({
          ...item,
          // Map period to the expected key (day/month) for compatibility
          day: item.period,
          month: item.period,
        }));
        setChartData(transformedData);
        console.log('Review trends data fetched:', transformedData);
      } else {
        console.error('API returned error:', result.message);
        // Fallback to dashboard stats
        setChartData(getFallbackData(timeframe));
        setError('Failed to load trend data');
      }
    } catch (error) {
      console.error('Error fetching trend data:', error);
      // Fallback to dashboard stats
      setChartData(getFallbackData(timeframe));
      setError('Failed to load trend data');
    } finally {
      setLoading(false);
    }
  };

  // Fallback to dashboard stats if API fails
  const getFallbackData = (timeframe: string): TrendData[] => {
    let fallbackData: any[] = [];
    switch (timeframe) {
      case '7 Days':
        fallbackData = dashboardStats.reviewTrends7Days || [];
        break;
      case '30 Days':
        fallbackData = dashboardStats.reviewTrends30Days || [];
        break;
      case '3 Months':
        fallbackData = dashboardStats.reviewTrends3Months || [];
        break;
      case '12 Months':
      default:
        fallbackData = dashboardStats.reviewTrends || [];
    }
    return fallbackData.map((item: any) => ({
      period: item.month || item.day || 'Unknown',
      count: item.count || 0,
      date: item.month || item.day || 'Unknown',
    }));
  };

  // Handle timeframe change
  const handleTimeframeChange = (timeframe: TimeframePeriod) => {
    setCurrentTimeframe(timeframe);
  };

  // Fetch data when timeframe or profileId changes
  useEffect(() => {
    const currentProfileId = searchParams.get('profileId') || 'all';
    fetchTrendData(currentTimeframe, currentProfileId);
  }, [currentTimeframe, searchParams]);

  const dataKey = getChartDataKey();
  console.log('ReviewTrends - selectedTimeframe:', currentTimeframe);
  console.log('ReviewTrends - chartData:', chartData);
  console.log('ReviewTrends - loading:', loading);

  // Calculate summary stats
  const totalReviews = chartData.reduce((acc, item) => acc + item.count, 0);
  const avgReviews = chartData.length > 0 ? Math.round(totalReviews / chartData.length) : 0;
  const maxReviews = Math.max(...chartData.map((item) => item.count), 0);

  return (
    <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-400 border-2 border-chart-1/80 shadow-chart-1/15">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-primary">Review Trends</h3>
          {error && <p className="text-xs text-red-500 mt-1">Using cached data - {error}</p>}
          {loading && <p className="text-xs text-primary/60 mt-1">Loading...</p>}
        </div>
        <div className="flex space-x-2">
          {(['12 Months', '3 Months', '30 Days', '7 Days'] as TimeframePeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => handleTimeframeChange(period)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                currentTimeframe === period
                  ? 'bg-primary text-white shadow-md'
                  : 'text-primary/70 hover:bg-[#F0EDE0] hover:text-primary'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="h-[280px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : chartData.length > 0 ? (
        <div className="w-full overflow-hidden">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorReviewBars" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B5C58" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#0B5C58" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#D1D9D8" />
              <XAxis
                dataKey={dataKey}
                stroke="#1B5551"
                fontSize={10}
                fontWeight={500}
                axisLine={false}
                tickLine={false}
                angle={
                  currentTimeframe === '3 Months' || currentTimeframe === '12 Months' ? -45 : 0
                }
                textAnchor={
                  currentTimeframe === '3 Months' || currentTimeframe === '12 Months'
                    ? 'end'
                    : 'middle'
                }
                height={
                  currentTimeframe === '3 Months' || currentTimeframe === '12 Months' ? 60 : 30
                }
              />
              <YAxis
                stroke="#1B5551"
                fontSize={10}
                fontWeight={500}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Reviews', angle: -90, position: 'insideLeft' }}
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
                formatter={(value: any) => [value, 'Reviews']}
                labelFormatter={(label: string) => `Period: ${label}`}
                cursor={{ fill: 'rgba(11, 92, 88, 0.1)' }}
              />
              <Bar
                dataKey="count"
                fill="url(#colorReviewBars)"
                radius={[4, 4, 0, 0]}
                name="Reviews"
                stroke="#0B5C58"
                strokeWidth={1}
              />
            </BarChart>
          </ResponsiveContainer>
          {/* Summary Stats */}
          {/* <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalReviews}</p>
              <p className="text-xs text-primary/60">Total Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{avgReviews}</p>
              <p className="text-xs text-primary/60">
                Avg per{' '}
                {currentTimeframe === '7 Days' || currentTimeframe === '30 Days'
                  ? 'Day'
                  : 'Period'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{maxReviews}</p>
              <p className="text-xs text-primary/60">Peak Reviews</p>
            </div>
          </div> */}
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center border- border-chart-1/80 shadow-chart-1/15 text-primary/60">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary/30" />
            <p className="text-base font-medium">No trend data available</p>
            <p className="text-xs text-primary/40 mt-1">
              Data will appear as reviews are collected
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
