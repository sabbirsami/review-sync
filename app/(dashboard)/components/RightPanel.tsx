interface RightPanelProps {
  dashboardStats: {
    responseRate: number;
    monthlyGrowth: number;
  };
  profileStats: Array<{
    profileId: string;
    profileName: string;
    totalReviews: number;
    averageRating: number;
    pendingReplies: number;
    responseRate: number;
    lastReviewDate: string;
    growth: number;
  }>;
}

export default function RightPanel({ dashboardStats, profileStats }: RightPanelProps) {
  const COLORS = ['#0B5C58', '#1B5551', '#FBD686', '#A8D5D1', '#F7F4E9'];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Response Rate */}
      <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-400 border-2 border-chart-1/80 shadow-chart-1/15">
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
          <span className="ml-2 bg-[#0B5C58] text-white text-xs px-2 py-1 rounded">Target 90%</span>
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
        <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-400 border-2 border-chart-1/80 shadow-chart-1/15">
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
                  num === 1 ? 'bg-[#0B5C58] text-white' : 'text-[#1B5551]/70 hover:bg-[#F0EDE0]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
