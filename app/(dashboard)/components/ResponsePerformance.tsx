'use client';
import { Clock } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ResponsePerformanceProps {
  dashboardStats: {
    responseTrends: Array<{ month: string; responseTime: number; replyRate: number }>;
  };
}

export default function ResponsePerformance({ dashboardStats }: ResponsePerformanceProps) {
  return (
    <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-400 border-2 border-chart-1/80 shadow-chart-1/15">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary">Response Performance</h3>
        <div className="flex space-x-2">
          <a
            href="?tab=response-time"
            className="px-3 py-1 rounded text-sm bg-primary text-white font-medium"
          >
            Response Time
          </a>
          <a
            href="?tab=reply-rate"
            className="px-3 py-1 rounded text-sm text-primary/70 hover:bg-[#F0EDE0] font-medium"
          >
            Reply Rate
          </a>
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
