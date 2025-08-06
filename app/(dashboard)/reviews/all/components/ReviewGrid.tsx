import SearchIcon from '@/components/icons/SearchIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewDocument } from '@/types/review';
import ReviewCard from './ReviewCard';

export default function ReviewGrid({
  reviews,
  searchTerm,
  filterStatus,
  filterRating,
  filterProfile,
}: {
  reviews: ReviewDocument[];
  searchTerm: string;
  filterStatus: string;
  filterRating: string;
  filterProfile: string;
}) {
  // The reviews prop is now expected to be already filtered and paginated by the API.
  // Removed client-side filtering logic.
  if (reviews?.length === 0) {
    return (
      <Card className="border border-[#D1D9D8] bg-white">
        <CardContent className="py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-[#F0EDE0] rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="w-10 h-10 text-foreground/40" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No reviews found</h3>
            <p className="text-foreground/70 mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find the reviews you&apos;re looking
              for.
            </p>
            <Button className="bg-gradient-to-r from-primary to-foreground text-white">
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div id="reviews-container" className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {(() => {
        // Distribute reviews into columns for display
        const numColumns = 4;
        const columns: ReviewDocument[][] = Array.from({ length: numColumns }, () => []);
        reviews.forEach((review, index) => {
          columns[index % numColumns].push(review);
        });

        return (
          <>
            {columns.map((columnReviews, colIndex) => (
              <div key={`column-${colIndex}`} className="grid 2xl:gap-3 gap-4">
                {columnReviews.map((review, index) => (
                  <ReviewCard key={`col${colIndex}-${review?.reviewId}-${index}`} review={review} />
                ))}
              </div>
            ))}
          </>
        );
      })()}
    </div>
  );
}
