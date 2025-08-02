// Create this file: /app/api/debug-reviews/route.ts
import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection('reviews');

    // Get basic stats
    const totalCount = await collection.countDocuments();

    // Get a few sample documents
    const samples = await collection.find({}).limit(3).toArray();

    // Get distinct field values to understand data structure
    const distinctRatings = await collection.distinct('starRating');
    const distinctProfiles = await collection.distinct('businessProfileName');

    // Check for different field variations
    const fieldChecks = await collection
      .aggregate([
        {
          $project: {
            hasReviewReply: { $type: '$reviewReply' },
            hasReplyComment: { $type: '$reviewReply.comment' },
            starRatingType: { $type: '$starRating' },
            createTimeType: { $type: '$createTime' },
          },
        },
        { $limit: 10 },
      ])
      .toArray();

    return NextResponse.json({
      success: true,
      totalDocuments: totalCount,
      sampleDocuments: samples.map((doc) => ({
        _id: doc._id,
        reviewId: doc.reviewId,
        starRating: doc.starRating,
        businessProfileName: doc.businessProfileName,
        hasReviewReply: !!doc.reviewReply,
        replyComment: doc.reviewReply?.comment || null,
        createTime: doc.createTime,
        fields: Object.keys(doc),
      })),
      distinctRatings,
      distinctProfiles,
      fieldTypes: fieldChecks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
