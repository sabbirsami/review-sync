import { reviewService } from '@/lib/services/reviewService';
import { ReviewDocument } from '@/types/review';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    const status = searchParams.get('status');
    const rating = searchParams.get('rating');
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const skip = Number.parseInt(searchParams.get('skip') || '0');

    console.log('=== Reviews API Called ===');
    console.log('Fetching reviews with filters:', { profileId, status, rating, limit, skip });

    const result = await reviewService.getAllReviews({
      profileId: profileId || undefined,
      status: status || undefined,
      rating: rating || undefined,
      limit,
      skip,
    });

    console.log('Reviews fetched successfully:', {
      count: result.reviews.length,
      total: result.total,
    });

    return NextResponse.json({
      reviews: result.reviews,
      total: result.total,
      hasMore: result.total > skip + limit,
    });
  } catch (error) {
    console.error('=== Reviews API Error ===');
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
    const body = await request.json();

    console.log('Creating review:', body);

    // Process the review data from n8n webhook
    const reviewData = {
      reviewId: body.reviewId,
      businessProfileId: body.businessProfileId || 'profile_1',
      businessProfileName: body.businessProfileName || 'Cardamom Restaurant - Main Branch',
      reviewer: body.reviewer || {},
      starRating: body.starRating,
      comment: body.comment || '',
      createTime: body.createTime,
      updateTime: body.updateTime,
      reviewReply: body.reviewReply,
      replyStatus: body.reviewReply ? 'replied' : 'pending',
      sentimentScore: body.sentimentScore,
      responseTimeHours: body.responseTimeHours,
      name: body.name,
    };

    const review = await reviewService.createReview(reviewData as ReviewDocument);

    return NextResponse.json({
      success: true,
      message: 'Review created successfully',
      reviewId: review.reviewId,
    });
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
