import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== Debug API Called ===');

    const db = await getDatabase();
    const collection = db.collection('reviews');

    // Get basic stats
    const totalCount = await collection.countDocuments();
    console.log('Total documents:', totalCount);

    // Get sample documents
    const sampleDocs = await collection.find({}).limit(3).toArray();
    console.log('Sample documents:', JSON.stringify(sampleDocs, null, 2));

    // Check field variations
    const fieldAnalysis = await collection
      .aggregate([
        {
          $project: {
            hasReviewReply: { $type: '$reviewReply' },
            reviewReplyExists: { $ne: ['$reviewReply', null] },
            starRatingValue: '$starRating',
            businessProfileName: '$businessProfileName',
            createTimeType: { $type: '$createTime' },
          },
        },
        {
          $group: {
            _id: null,
            reviewReplyTypes: { $addToSet: '$hasReviewReply' },
            starRatingValues: { $addToSet: '$starRatingValue' },
            businessProfiles: { $addToSet: '$businessProfileName' },
            createTimeTypes: { $addToSet: '$createTimeType' },
            withReviewReply: { $sum: { $cond: ['$reviewReplyExists', 1, 0] } },
            withoutReviewReply: { $sum: { $cond: ['$reviewReplyExists', 0, 1] } },
          },
        },
      ])
      .toArray();

    console.log('Field analysis:', JSON.stringify(fieldAnalysis, null, 2));

    return NextResponse.json({
      success: true,
      totalDocuments: totalCount,
      sampleDocuments: sampleDocs,
      fieldAnalysis: fieldAnalysis[0] || {},
      message: 'Debug information retrieved successfully',
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
