import Header from '@/components/share/header/Header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingError from './components/LoadingError';
import RatingDistribution from './components/RatingDistribution';
import RecentActivity from './components/RecentActivity';
import ResponsePerformance from './components/ResponsePerformance';
import ReviewTrends from './components/ReviewTrends';
import RightPanel from './components/RightPanel';
import StatsCards from './components/StatsCards';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; timeframe?: string }>;
}) {
  // Await the searchParams Promise
  const params = await searchParams;
  const activeTab = params.tab || 'Value comparison';
  const selectedTimeframe = params.timeframe || '12 Months';

  // Fetch data in the server component
  let dashboardStats = null;
  let profileStats = [];
  let recentReviews = [];
  let error = null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const [statsRes, reviewsRes] = await Promise.all([
      fetch(`${apiUrl}/api/stats`, { cache: 'no-store' }),
      fetch(`${apiUrl}/api/reviews?limit=4`, {
        cache: 'no-store',
      }),
    ]);

    if (!statsRes.ok) throw new Error('Failed to fetch stats');
    if (!reviewsRes.ok) throw new Error('Failed to fetch reviews');

    const statsData = await statsRes.json();
    const reviewsData = await reviewsRes.json();

    dashboardStats = statsData.dashboardStats;
    profileStats = statsData.profileStats || [];
    recentReviews = reviewsData.success ? reviewsData.data.reviews || [] : [];
  } catch (err) {
    console.error('Error fetching data:', err);
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  if (error) return <LoadingError error={error} />;
  if (!dashboardStats) return <LoadingError />;

  return (
    <div className="min-h-screen bg-[#F7F4E9] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-primary pt-4">
        <Header title={'Business Analytics'} />
        {/* Tabs */}
        <div className="px-6 sticky top-0 bg-white">
          <Tabs value={activeTab} className="sticky top-[68px] bg-white z-10">
            <TabsList className="bg-white p-0 h-auto">
              {['Value comparison', 'Average values', 'Configure analysis', 'Filter analysis'].map(
                (tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`py-3.5 px-0 mr-8 text-sm font-medium border-b-4 border-t-0 border-x-0 data-[state=active]:bg-white bg-white rounded-none data-[state=active]:shadow-none ${
                      activeTab === tab
                        ? 'border-primary text-primary bg-white'
                        : 'border-transparent text-foreground/60 hover:text-foreground'
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
        <StatsCards dashboardStats={dashboardStats} />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <ReviewTrends dashboardStats={dashboardStats} selectedTimeframe={selectedTimeframe} />
          </div>
          <RatingDistribution dashboardStats={dashboardStats} />
        </div>
        <ResponsePerformance dashboardStats={dashboardStats} />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 pt-2">
            <RecentActivity initialReviews={recentReviews} />
          </div>
          <RightPanel dashboardStats={dashboardStats} profileStats={profileStats} />
        </div>
      </div>
    </div>
  );
}
