/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDatabase } from '@/lib/mongodb';
import type { DashboardStatsDocument, ProfileStatsDocument, ReviewDocument } from '@/types/review';

export class ReviewService {
  private async getCollection(name: string) {
    try {
      const db = await getDatabase();
      return db.collection(name);
    } catch (error) {
      console.error('Error getting collection:', error);
      throw error;
    }
  }

  async getAllReviews(filters?: {
    profileId?: string;
    status?: string;
    rating?: string;
    limit?: number;
    skip?: number;
  }): Promise<{ reviews: ReviewDocument[]; total: number }> {
    try {
      const collection = await this.getCollection('reviews');

      const query: any = {};

      if (filters?.profileId && filters.profileId !== 'all') {
        query.businessProfileId = filters.profileId;
      }

      if (filters?.status && filters.status !== 'all') {
        query.replyStatus = filters.status;
      }

      if (filters?.rating && filters.rating !== 'all') {
        query.starRating = filters.rating;
      }

      console.log('Query:', query);

      const total = await collection.countDocuments(query);
      const reviews = (await collection
        .find(query)
        .sort({ createTime: -1 })
        .limit(filters?.limit || 50)
        .skip(filters?.skip || 0)
        .toArray()) as ReviewDocument[];

      console.log(`Found ${reviews.length} reviews out of ${total} total`);

      return { reviews, total };
    } catch (error) {
      console.error('Error in getAllReviews:', error);
      throw error;
    }
  }

  async createReview(
    reviewData: Omit<ReviewDocument, '_id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ReviewDocument> {
    try {
      const collection = await this.getCollection('reviews');

      const review: ReviewDocument = {
        ...reviewData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(review);
      return { ...review, _id: result.insertedId };
    } catch (error) {
      console.error('Error in createReview:', error);
      throw error;
    }
  }

  async updateReview(
    reviewId: string,
    updateData: Partial<ReviewDocument>,
  ): Promise<ReviewDocument | null> {
    try {
      const collection = await this.getCollection('reviews');

      const result = await collection.findOneAndUpdate(
        { reviewId },
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
          },
        },
        { returnDocument: 'after' },
      );

      return result as ReviewDocument | null;
    } catch (error) {
      console.error('Error in updateReview:', error);
      throw error;
    }
  }

  async getDashboardStats(): Promise<DashboardStatsDocument> {
    try {
      const collection = await this.getCollection('reviews');

      console.log('Calculating dashboard stats...');

      // Get total reviews
      const totalReviews = await collection.countDocuments();
      console.log('Total reviews:', totalReviews);

      if (totalReviews === 0) {
        return {
          totalReviews: 0,
          pendingReplies: 0,
          averageRating: 0,
          responseRate: 0,
          reviewTrends: [],
          ratingDistribution: [],
          lastUpdated: new Date(),
        };
      }

      // Get a sample document to understand the structure
      const sampleDoc = await collection.findOne();
      console.log('Sample document structure:', JSON.stringify(sampleDoc, null, 2));

      // Get pending replies - more flexible approach
      let pendingReplies = 0;
      try {
        pendingReplies = await collection.countDocuments({
          $or: [
            { reviewReply: { $exists: false } },
            { reviewReply: null },
            { reviewReply: { $eq: null } },
            { 'reviewReply.comment': { $exists: false } },
            { 'reviewReply.comment': null },
            { 'reviewReply.comment': '' },
          ],
        });
        console.log('Pending replies:', pendingReplies);
      } catch (error) {
        console.error('Error calculating pending replies:', error);
        pendingReplies = 0;
      }

      // Calculate average rating with error handling
      let averageRating = 0;
      try {
        const ratingPipeline = [
          {
            $addFields: {
              numericRating: {
                $switch: {
                  branches: [
                    { case: { $eq: ['$starRating', 'ONE'] }, then: 1 },
                    { case: { $eq: ['$starRating', 'TWO'] }, then: 2 },
                    { case: { $eq: ['$starRating', 'THREE'] }, then: 3 },
                    { case: { $eq: ['$starRating', 'FOUR'] }, then: 4 },
                    { case: { $eq: ['$starRating', 'FIVE'] }, then: 5 },
                  ],
                  default: 3, // Default to 3 if rating format is unexpected
                },
              },
            },
          },
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$numericRating' },
            },
          },
        ];

        const ratingResult = await collection.aggregate(ratingPipeline).toArray();
        averageRating = ratingResult[0]?.averageRating || 0;
        console.log('Average rating:', averageRating);
      } catch (error) {
        console.error('Error calculating average rating:', error);
        averageRating = 0;
      }

      // Calculate response rate
      let responseRate = 0;
      try {
        const repliedReviews = await collection.countDocuments({
          $and: [
            { reviewReply: { $exists: true } },
            { reviewReply: { $ne: null } },
            { 'reviewReply.comment': { $exists: true } },
            { 'reviewReply.comment': { $ne: null } },
            { 'reviewReply.comment': { $ne: '' } },
          ],
        });
        responseRate = totalReviews > 0 ? (repliedReviews / totalReviews) * 100 : 0;
        console.log(
          'Response rate:',
          responseRate,
          'Replied:',
          repliedReviews,
          'Total:',
          totalReviews,
        );
      } catch (error) {
        console.error('Error calculating response rate:', error);
        responseRate = 0;
      }

      // Get rating distribution with error handling
      let ratingDistribution: Array<{ rating: number; count: number }> = [];
      try {
        const ratingDistPipeline = [
          {
            $addFields: {
              numericRating: {
                $switch: {
                  branches: [
                    { case: { $eq: ['$starRating', 'ONE'] }, then: 1 },
                    { case: { $eq: ['$starRating', 'TWO'] }, then: 2 },
                    { case: { $eq: ['$starRating', 'THREE'] }, then: 3 },
                    { case: { $eq: ['$starRating', 'FOUR'] }, then: 4 },
                    { case: { $eq: ['$starRating', 'FIVE'] }, then: 5 },
                  ],
                  default: 3,
                },
              },
            },
          },
          {
            $group: {
              _id: '$numericRating',
              count: { $sum: 1 },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ];

        const ratingDistResult = await collection.aggregate(ratingDistPipeline).toArray();
        ratingDistribution = ratingDistResult.map((item) => ({
          rating: item._id,
          count: item.count,
        }));
        console.log('Rating distribution:', ratingDistribution);
      } catch (error) {
        console.error('Error calculating rating distribution:', error);
        ratingDistribution = [];
      }

      // Get review trends with error handling
      let reviewTrends: Array<{ month: string; count: number }> = [];
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const trendsPipeline = [
          {
            $addFields: {
              createDate: {
                $cond: {
                  if: { $type: '$createTime' },
                  then: {
                    $dateFromString: {
                      dateString: '$createTime',
                      onError: new Date(), // fallback for invalid dates
                    },
                  },
                  else: new Date(),
                },
              },
            },
          },
          {
            $match: {
              createDate: { $gte: sixMonthsAgo },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: '$createDate' },
                month: { $month: '$createDate' },
              },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { '_id.year': 1, '_id.month': 1 },
          },
        ];

        const trendsResult = await collection.aggregate(trendsPipeline).toArray();
        reviewTrends = trendsResult.map((item) => ({
          month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', {
            month: 'short',
          }),
          count: item.count,
        }));
        console.log('Review trends:', reviewTrends);
      } catch (error) {
        console.error('Error calculating review trends:', error);
        reviewTrends = [];
      }

      const stats = {
        totalReviews,
        pendingReplies,
        averageRating: Math.round(averageRating * 10) / 10,
        responseRate: Math.round(responseRate * 10) / 10,
        reviewTrends,
        ratingDistribution,
        lastUpdated: new Date(),
      };

      console.log('Dashboard stats calculated successfully:', stats);
      return stats;
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      // Return default stats instead of throwing
      return {
        totalReviews: 0,
        pendingReplies: 0,
        averageRating: 0,
        responseRate: 0,
        reviewTrends: [],
        ratingDistribution: [],
        lastUpdated: new Date(),
      };
    }
  }

  async getProfileStats(): Promise<ProfileStatsDocument[]> {
    try {
      const collection = await this.getCollection('reviews');

      console.log('Calculating profile stats...');

      const pipeline = [
        {
          $group: {
            _id: {
              $ifNull: ['$businessProfileName', 'Unknown Profile'],
            },
            totalReviews: { $sum: 1 },
            pendingReplies: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $eq: [{ $ifNull: ['$reviewReply', null] }, null] },
                      { $eq: [{ $ifNull: ['$reviewReply.comment', null] }, null] },
                      { $eq: [{ $ifNull: ['$reviewReply.comment', ''] }, ''] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            repliedReviews: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $ne: [{ $ifNull: ['$reviewReply', null] }, null] },
                      { $ne: [{ $ifNull: ['$reviewReply.comment', null] }, null] },
                      { $ne: [{ $ifNull: ['$reviewReply.comment', ''] }, ''] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            averageRating: {
              $avg: {
                $switch: {
                  branches: [
                    { case: { $eq: ['$starRating', 'ONE'] }, then: 1 },
                    { case: { $eq: ['$starRating', 'TWO'] }, then: 2 },
                    { case: { $eq: ['$starRating', 'THREE'] }, then: 3 },
                    { case: { $eq: ['$starRating', 'FOUR'] }, then: 4 },
                    { case: { $eq: ['$starRating', 'FIVE'] }, then: 5 },
                  ],
                  default: 3,
                },
              },
            },
            lastReviewDate: { $max: '$createTime' },
          },
        },
        {
          $addFields: {
            responseRate: {
              $cond: [
                { $eq: ['$totalReviews', 0] },
                0,
                { $multiply: [{ $divide: ['$repliedReviews', '$totalReviews'] }, 100] },
              ],
            },
          },
        },
      ];

      const result = await collection.aggregate(pipeline).toArray();
      console.log('Profile stats raw result:', result);

      const profileStats = result.map((item, index) => ({
        profileId: `profile_${index + 1}`,
        profileName: item._id || 'Unknown Profile',
        totalReviews: item.totalReviews,
        averageRating: Math.round(item.averageRating * 10) / 10,
        pendingReplies: item.pendingReplies,
        responseRate: Math.round(item.responseRate * 10) / 10,
        lastReviewDate: item.lastReviewDate,
      }));

      console.log('Profile stats calculated:', profileStats);
      return profileStats;
    } catch (error) {
      console.error('Error in getProfileStats:', error);
      return [];
    }
  }
}

export const reviewService = new ReviewService();
