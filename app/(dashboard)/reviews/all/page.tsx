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
  name: string; // Add the required name property
}

export default async function ReviewMainPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    status?: string;
    rating?: string;
    profile?: string;
  };
}) {
  const searchTerm = searchParams.search || '';
  const filterStatus = searchParams.status || 'all';
  const filterRating = searchParams.rating || 'all';
  const filterProfile = searchParams.profile || 'all';

  let reviews: Review[] = [];
  const loading = false;

  try {
    const params = new URLSearchParams({
      limit: '100',
      ...(filterStatus !== 'all' && { status: filterStatus }),
      ...(filterRating !== 'all' && { rating: filterRating }),
      ...(filterProfile !== 'all' && { profileId: filterProfile }),
    });

    const response = await fetch(`http://localhost:3000/api/reviews?${params}`, {
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
