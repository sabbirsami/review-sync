import Header from '@/components/share/header/Header';
import Filters from './components/Filters';
import LoadingState from './components/LoadingState';
import ReviewGrid from './components/ReviewGrid';
import ReviewStats from './components/ReviewStats';

interface Review {
  reviewId: string;
  businessProfileName: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl: string;
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
  name: string;
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    rating?: string;
    profile?: string;
  }>;
}

export default async function ReviewMainPage({ searchParams }: PageProps) {
  // Await the searchParams Promise
  const params = await searchParams;

  const searchTerm = params.search || '';
  const filterStatus = params.status || 'all';
  const filterRating = params.rating || 'all';
  const filterProfile = params.profile || 'all';

  let reviews: Review[] = [];
  const loading = false;

  try {
    const queryParams = new URLSearchParams({
      limit: '100',
      ...(filterStatus !== 'all' && { status: filterStatus }),
      ...(filterRating !== 'all' && { rating: filterRating }),
      ...(filterProfile !== 'all' && { profileId: filterProfile }),
    });
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/reviews?${queryParams}`, {
      next: { revalidate: 60 },
    });

    const data = await response.json();
    if (data.reviews) {
      reviews = data.reviews;
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-[#F7F4E9] flex flex-col">
      <div className="bg-white border-b border-primary pt-4">
        <Header title={'Review Management'} />
        <Filters
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          filterRating={filterRating}
          filterProfile={filterProfile}
          uniqueProfiles={Array.from(new Set(reviews.map((review) => review.businessProfileName)))}
        />
      </div>
      <div className="flex-1 p-6 space-y-6">
        <ReviewStats
          reviews={reviews}
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          filterRating={filterRating}
          filterProfile={filterProfile}
        />
        <ReviewGrid
          reviews={reviews}
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          filterRating={filterRating}
          filterProfile={filterProfile}
        />
      </div>
    </div>
  );
}
