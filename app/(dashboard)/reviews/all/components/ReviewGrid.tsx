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
  const filteredReviews = reviews?.filter((review) => {
    const matchesSearch =
      review?.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review?.reviewer?.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review?.businessProfileName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || review?.replyStatus === filterStatus;
    const matchesRating = filterRating === 'all' || review?.starRating === filterRating;
    const matchesProfile = filterProfile === 'all' || review?.businessProfileName === filterProfile;

    return matchesSearch && matchesStatus && matchesRating && matchesProfile;
  });

  if (filteredReviews?.length === 0) {
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
        const totalCardInRow = Math.ceil(filteredReviews?.length / 4);
        const row1 = 0 + totalCardInRow;
        const row2 = row1 + totalCardInRow;
        const row3 = row2 + totalCardInRow;
        const row4 = row3 + totalCardInRow;

        return (
          <>
            {/* Column 1 */}
            <div key="column-1" className="grid 2xl:gap-3 gap-4">
              {filteredReviews?.slice(0, row1).map((review, index) => (
                <ReviewCard key={`col1-${review?.reviewId}-${index}`} review={review} />
              ))}
            </div>

            {/* Column 2 */}
            <div key="column-2" className="grid 2xl:gap-3 gap-4">
              {filteredReviews?.slice(row1, row2).map((review, index) => (
                <ReviewCard key={`col2-${review?.reviewId}-${index}`} review={review} />
              ))}
            </div>

            {/* Column 3 */}
            <div key="column-3" className="grid 2xl:gap-3 gap-4">
              {filteredReviews?.slice(row2, row3).map((review, index) => (
                <ReviewCard key={`col3-${review?.reviewId}-${index}`} review={review} />
              ))}
            </div>

            {/* Column 4 */}
            <div key="column-4" className="grid 2xl:gap-3 gap-4">
              {filteredReviews?.slice(row3, row4).map((review, index) => (
                <ReviewCard key={`col4-${review?.reviewId}-${index}`} review={review} />
              ))}
            </div>
          </>
        );
      })()}
    </div>
  );
}
