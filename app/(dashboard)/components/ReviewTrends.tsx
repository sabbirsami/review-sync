/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { BarChart3 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ReviewTrendsProps {
  dashboardStats: {
    reviewTrends?: Array<{ month: string; count: number; rating?: number }>;
    reviewTrends3Months?: Array<{ month: string; count: number; rating?: number }>;
    reviewTrends30Days?: Array<{ day: string; count: number; rating?: number }>;
    reviewTrends7Days?: Array<{ day: string; count: number; rating?: number }>;
  };
  selectedTimeframe: string;
}

export default function ReviewTrends({ dashboardStats, selectedTimeframe }: ReviewTrendsProps) {
  const getChartData = () => {
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

  const chartData = getChartData();
  const dataKey = getChartDataKey();

  console.log('ReviewTrends - selectedTimeframe:', selectedTimeframe);
  console.log('ReviewTrends - chartData:', chartData);

  return (
    <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-400 border-2 border-chart-1/80 shadow-chart-1/15">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary">Review Trends</h3>
        <div className="flex space-x-2">
          {['12 Months', '3 Months', '30 Days', '7 Days'].map((period) => (
            <a
              key={period}
              href={`?timeframe=${period}`}
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                selectedTimeframe === period
                  ? 'bg-primary text-white shadow-md'
                  : 'text-primary/70 hover:bg-[#F0EDE0] hover:text-primary'
              }`}
            >
              {period}
            </a>
          ))}
        </div>
      </div>
      {chartData.length > 0 ? (
        <div className="w-full overflow-hidden">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D1D9D8" />
              <XAxis
                dataKey={dataKey}
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
                formatter={(value: any) => [value, 'Reviews']}
                labelFormatter={(label: string) => `Period: ${label}`}
              />
              <Bar dataKey="count" fill="#0B5C58" radius={[4, 4, 0, 0]} name="Reviews" />
            </BarChart>
          </ResponsiveContainer>
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
