import { Star } from 'lucide-react';

interface RatingDistributionProps {
  dashboardStats: {
    ratingDistribution: Array<{ rating: number; count: number }>;
    totalReviews: number;
  };
}

export default function RatingDistribution({ dashboardStats }: RatingDistributionProps) {
  return (
    <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-400 border-2 border-chart-1/80 shadow-chart-1/15">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-lg font-semibold text-[#1B5551]">Rating Distribution</h3>
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
                      <span className="text-sm font-bold text-[#1B5551] w-4">{item.rating}</span>
                      <Star className="w-4 h-4 fill-[#FBD686] text-[#FBD686]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#1B5551]">{item.count}</span>
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
  );
}
