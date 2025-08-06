/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Clock } from 'lucide-react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ResponsePerformanceProps {
  dashboardStats: {
    responseTrends?: Array<{ month: string; responseTime: number; replyRate: number }>;
  };
  profileId?: string; // Add profileId prop
}

type TimePeriod = '7d' | '30d' | '3m';
type MetricType = 'responseTime' | 'replyRate';

interface TrendData {
  period: string;
  responseTime: number;
  replyRate: number;
  date: string;
}

export default function ResponsePerformance({
  dashboardStats,
  profileId,
}: ResponsePerformanceProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('responseTime');
  const [filteredData, setFilteredData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams(); // Use useSearchParams to get current profileId

  // Fetch trend data from API
  const fetchTrendData = async (period: TimePeriod, currentProfileId: string) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ period });
      if (currentProfileId && currentProfileId !== 'all') {
        queryParams.set('profileId', currentProfileId);
      }
      const response = await fetch(`/api/response-trends?${queryParams.toString()}`);
      const result = await response.json();
      if (result.success && result.data) {
        setFilteredData(result.data);
      } else {
        console.error('API returned error:', result.message);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching trend data:', error);
      // Fallback to empty data
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentProfileId = searchParams.get('profileId') || 'all';
    fetchTrendData(selectedPeriod, currentProfileId);
  }, [selectedPeriod, searchParams]); // Depend on searchParams

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
  };

  const handleMetricChange = (metric: MetricType) => {
    setSelectedMetric(metric);
  };

  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case '7d':
        return 'Last 7 Days';
      case '30d':
        return 'Last 30 Days';
      case '3m':
        return 'Last 3 Months';
      default:
        return 'Last 30 Days';
    }
  };

  const renderChart = () => {
    if (selectedMetric === 'responseTime') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="colorResponseTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0B5C58" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0B5C58" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#D1D9D8" />
            <XAxis
              dataKey="period"
              stroke="#1B5551"
              fontSize={10}
              fontWeight={500}
              axisLine={false}
              tickLine={false}
              angle={selectedPeriod === '3m' ? -45 : 0}
              textAnchor={selectedPeriod === '3m' ? 'end' : 'middle'}
              height={selectedPeriod === '3m' ? 60 : 30}
            />
            <YAxis
              stroke="#1B5551"
              fontSize={10}
              fontWeight={500}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
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
              formatter={(value: any) => [`${value}h`, 'Response Time']}
              labelFormatter={(label) => `Period: ${label}`}
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
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D1D9D8" />
            <XAxis
              dataKey="period"
              stroke="#1B5551"
              fontSize={10}
              fontWeight={500}
              axisLine={false}
              tickLine={false}
              angle={selectedPeriod === '3m' ? -45 : 0}
              textAnchor={selectedPeriod === '3m' ? 'end' : 'middle'}
              height={selectedPeriod === '3m' ? 60 : 30}
            />
            <YAxis
              stroke="#1B5551"
              fontSize={10}
              fontWeight={500}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              label={{ value: '% Replied', angle: -90, position: 'insideLeft' }}
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
              formatter={(value: any) => [`${value}%`, 'Reply Rate']}
              labelFormatter={(label) => `Period: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="replyRate"
              stroke="#0B5C58"
              strokeWidth={3}
              dot={{ fill: '#0B5C58', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#0B5C58', strokeWidth: 2, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-400 border-2 border-chart-1/80 shadow-chart-1/15">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-primary">Response Performance</h3>
          <p className="text-sm text-primary/60 mt-1">{getPeriodLabel(selectedPeriod)}</p>
        </div>
        {/* Time Period Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '3m'] as TimePeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-primary text-white'
                    : 'text-primary/70 hover:bg-primary/10'
                }`}
              >
                {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '3 Months'}
              </button>
            ))}
          </div>
          {/* Metric Selector */}
          <div className="flex space-x-2">
            <button
              onClick={() => handleMetricChange('responseTime')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedMetric === 'responseTime'
                  ? 'bg-primary text-white'
                  : 'text-primary/70 hover:bg-[#F0EDE0]'
              }`}
            >
              Response Time
            </button>
            <button
              onClick={() => handleMetricChange('replyRate')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedMetric === 'replyRate'
                  ? 'bg-primary text-white'
                  : 'text-primary/70 hover:bg-[#F0EDE0]'
              }`}
            >
              Reply Rate
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="h-[389px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredData.length > 0 ? (
        <div className="w-full overflow-hidden">
          {renderChart()}
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {selectedMetric === 'responseTime'
                  ? `${(
                      filteredData.reduce((acc, d) => acc + d.responseTime, 0) / filteredData.length
                    ).toFixed(1)}h`
                  : `${(
                      filteredData.reduce((acc, d) => acc + d.replyRate, 0) / filteredData.length
                    ).toFixed(1)}%`}
              </p>
              <p className="text-xs text-primary/60">Average</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {selectedMetric === 'responseTime'
                  ? `${Math.min(...filteredData.map((d) => d.responseTime)).toFixed(1)}h`
                  : `${Math.max(...filteredData.map((d) => d.replyRate)).toFixed(1)}%`}
              </p>
              <p className="text-xs text-primary/60">
                {selectedMetric === 'responseTime' ? 'Fastest' : 'Best'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                {selectedMetric === 'responseTime'
                  ? `${Math.max(...filteredData.map((d) => d.responseTime)).toFixed(1)}h`
                  : `${Math.min(...filteredData.map((d) => d.replyRate)).toFixed(1)}%`}
              </p>
              <p className="text-xs text-primary/60">
                {selectedMetric === 'responseTime' ? 'Slowest' : 'Lowest'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center border- border-chart-1/80 shadow-chart-1/15 text-primary/60">
          <div className="text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-primary/30" />
            <p className="text-base font-medium">No response data available</p>
            <p className="text-xs text-primary/40 mt-1">
              Data will appear as responses are tracked
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
