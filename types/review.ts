export interface Review {
  _id?: string
  reviewId: string
  businessProfileId: string
  businessProfileName: string
  reviewer: {
    profilePhotoUrl: string
    displayName: string
  }
  starRating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE"
  comment: string
  createTime: string
  updateTime: string
  reviewReply?: {
    comment: string
    updateTime: string
    aiGenerated?: boolean
  }
  replyStatus: "pending" | "replied" | "ignored"
  sentimentScore?: number
  responseTimeHours?: number
  name: string
}

export interface ProfileStats {
  profileId: string
  profileName: string
  totalReviews: number
  averageRating: number
  pendingReplies: number
  responseRate: number
  lastReviewDate: string
}

export interface DashboardStats {
  totalReviews: number
  pendingReplies: number
  averageRating: number
  responseRate: number
  reviewTrends: Array<{ month: string; count: number }>
  ratingDistribution: Array<{ rating: number; count: number }>
}
