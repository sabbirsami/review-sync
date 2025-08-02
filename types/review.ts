import { ObjectId } from 'mongodb';

export interface ReviewDocument {
  _id?: ObjectId;
  reviewId: string;
  businessProfileId?: string;
  businessProfileName?: string;
  reviewer: {
    profilePhotoUrl: string;
    displayName: string;
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
  responseTimeHours?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProfileStatsDocument {
  _id?: ObjectId;
  profileId: string;
  profileName: string;
  totalReviews: number;
  averageRating: number;
  pendingReplies: number;
  responseRate: number;
  lastReviewDate: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DashboardStatsDocument {
  _id?: ObjectId;
  totalReviews: number;
  pendingReplies: number;
  averageRating: number;
  responseRate: number;
  reviewTrends: Array<{ month: string; count: number }>;
  ratingDistribution: Array<{ rating: number; count: number }>;
  lastUpdated: Date;
}
