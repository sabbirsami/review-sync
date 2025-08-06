import { CheckCircle2, Clock, Star, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  dashboardStats: {
    totalReviews: number;
    pendingReplies: number;
    averageRating: number;
    responseRate: number;
  };
}

export default function StatsCards({ dashboardStats }: StatsCardsProps) {
  // Calculate monthly growth (placeholder - you can implement actual calculation)
  const monthlyGrowth = Math.round(Math.random() * 15); // Replace with real calculation

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Total Reviews Card */}
      <div className="border-2 border-white hover:shadow-lg transition-shadow duration-400 shadow-chart-1/70 bg-chart-1/90 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Total Reviews</p>
            <p className="text-3xl font-bold text-white mt-1">
              {dashboardStats.totalReviews.toLocaleString()}
            </p>
            <div className="flex items-center mt-2 text-sm">
              {monthlyGrowth > 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+{monthlyGrowth}% this month</span>
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

      {/* Pending Responses Card */}
      <div className="rounded-lg border-white hover:shadow-lg transition-shadow duration-400 shadow-chart-3/70 bg-chart-3/90 p-6 border-2">
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

      {/* Average Rating Card */}
      <div className="rounded-lg p-6 bg-chart-4/90 border-2 border-white hover:shadow-lg transition-shadow duration-400 shadow-chart-4/70">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-chart-1">Average Rating</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {dashboardStats.averageRating.toFixed(1)}
            </p>
            <div className="flex items-center mt-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(dashboardStats.averageRating)
                      ? 'fill-[#FBD686] text-[#FBD686]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
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
  );
}
