import { reviewService } from '@/lib/services/reviewService';
import { GoogleReviewsResponse, ReviewDocument } from '@/types/review';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    const status = searchParams.get('status');
    const rating = searchParams.get('rating');
    const search = searchParams.get('search') || '';
    const page = Number(searchParams.get('page')) || 1;
    const limit = Math.min(Number(searchParams.get('limit')) || 10, 50); // Limit max items to prevent large responses
    const skip = (page - 1) * limit;

    const result = await reviewService.getAllReviews({
      profileId: profileId || undefined,
      status: status || undefined,
      rating: rating || undefined,
      search,
      limit,
      skip,
    });

    // Optimize response size by removing unnecessary fields for large datasets
    const optimizedReviews = result.reviews.map((review) => ({
      ...review,
      // Keep only essential fields to reduce response size
      _id: review._id?.toString(), // Convert ObjectId to string
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          reviews: optimizedReviews,
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0', // Prevent caching of large responses
        },
      },
    );
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch reviews',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GoogleReviewsResponse = await request.json();
    console.log('Received review data:', body);

    // Handle the new bulk review format
    if (body.reviews && Array.isArray(body.reviews)) {
      const createdReviews = await Promise.all(
        body.reviews.map((review) => {
          const reviewData: ReviewDocument = {
            reviewId: review.reviewId,
            businessProfileId: body.businessProfileId.toString(),
            businessProfileName: body.businessProfileName,
            executionTimestamp: body.executionTimestamp,
            reviewer: review.reviewer,
            starRating: review.starRating,
            comment: review.comment || '',
            createTime: review.createTime,
            updateTime: review.updateTime,
            reviewReply: review.reviewReply,
            replyStatus: review.reviewReply ? 'replied' : 'pending',
            name: review.name,
          };
          return reviewService.createReview(reviewData);
        }),
      );

      return NextResponse.json({
        success: true,
        message: `Processed ${createdReviews.length} reviews`,
        count: createdReviews.length,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid data format. Expected reviews array.',
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create review',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
