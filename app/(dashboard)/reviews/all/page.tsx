/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from '@/components/share/header/Header';
import { ReviewDocument } from '@/types/review';
import Filters from './components/Filters';
import LoadingState from './components/LoadingState';
import Pagination from './components/Pagination';
import ReviewGrid from './components/ReviewGrid';
import ReviewStats from './components/ReviewStats';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    rating?: string;
    profileId?: string; // Changed from 'profile' to 'profileId' for consistency
    page?: string;
    limit?: string;
  }>;
}

export default async function ReviewMainPage({ searchParams }: PageProps) {
  // Await searchParams before using its properties
  const params = await searchParams;
  const searchTerm = params.search || '';
  const filterStatus = params.status || 'all';
  const filterRating = params.rating || 'all';
  const filterProfileId = params.profileId || 'all'; // Use profileId
  const currentPage = Number(params.page) || 1;
  const limit = Number(params.limit) || 20;

  let reviews: ReviewDocument[] = [];
  let totalReviews = 0;
  let totalPages = 1;
  let uniqueProfiles: string[] = [];
  const loading = false; // This component is a Server Component, loading state is handled by Next.js suspense

  try {
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      page: currentPage.toString(),
      ...(filterStatus !== 'all' && { status: filterStatus }),
      ...(filterRating !== 'all' && { rating: filterRating }),
      ...(filterProfileId !== 'all' && { profileId: filterProfileId }), // Use profileId
      ...(searchTerm && { search: searchTerm }),
    });

    // Fetch paginated reviews for display
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/reviews?${queryParams}`, {
      cache: 'no-store',
    });
    const data = await response.json();

    if (data.success && data.data) {
      reviews = data.data.reviews;
      totalReviews = data.data.total;
      totalPages = data.data.totalPages;
    }

    // Fetch all profiles for filter dropdown
    const profilesResponse = await fetch(`${apiUrl}/api/stats`, {
      cache: 'no-store',
    });
    const profilesData = await profilesResponse.json();
    if (profilesData.profileStats) {
      uniqueProfiles = profilesData.profileStats.map((p: any) => p.profileId); // Map to profileId
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-white border-b border-primary pt-4">
        <Header title={'Review Management'} />
        <Filters
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          filterRating={filterRating}
          filterProfile={filterProfileId} // Pass profileId
          uniqueProfiles={uniqueProfiles}
        />
      </div>
      <div className="flex-1 p-6 space-y-6">
        <ReviewStats
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          filterRating={filterRating}
          filterProfile={filterProfileId} // Pass profileId
        />
        <ReviewGrid
          reviews={reviews}
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          filterRating={filterRating}
          filterProfile={filterProfileId} // Pass profileId
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalReviews}
          itemsPerPage={limit}
        />
      </div>
    </div>
  );
}
