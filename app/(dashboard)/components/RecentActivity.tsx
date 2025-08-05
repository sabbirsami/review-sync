'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Eye,
  MessageCircle,
  MoreHorizontal,
  Sparkles,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Review {
  reviewId: string;
  businessProfileName?: string;
  reviewer: {
    profilePhotoUrl: string;
    displayName: string;
  };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
    aiGenerated?: boolean;
  };
  replyStatus: 'pending' | 'replied' | 'ignored';
  sentimentScore?: number;
}

interface RecentActivityProps {
  recentReviews: Review[];
}

export default function RecentActivity({ recentReviews }: RecentActivityProps) {
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const toggleReviewExpand = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const toggleReplyExpand = (reviewId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const getRatingStars = (rating: string | number) => {
    const numRating =
      typeof rating === 'string'
        ? rating === 'ONE'
          ? 1
          : rating === 'TWO'
          ? 2
          : rating === 'THREE'
          ? 3
          : rating === 'FOUR'
          ? 4
          : 5
        : rating;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < numRating ? 'fill-[#FBD686] text-[#FBD686]' : 'text-gray-300'}`}
      />
    ));
  };

  const renderReviewCard = (review: Review) => (
    <Card
      key={review?.reviewId}
      className="border-2 border-primary/80 bg-white flex flex-col overflow-hidden rounded-lg transition-shadow hover:shadow-xl duration-300"
    >
      <CardContent className="px-6 flex flex-col">
        {/* Header Section */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={review?.reviewer?.profilePhotoUrl || '/placeholder.svg'}
                  alt={review?.reviewer?.displayName || 'Reviewer'}
                  width={32}
                  height={32}
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground text-sm grow">
                  {review?.reviewer?.displayName?.length > 20
                    ? `${review?.reviewer?.displayName?.slice(0, 20)}...`
                    : review?.reviewer?.displayName}
                </h4>
                <div className="flex items-center gap-2 -mt-1 text-xs text-foreground/60">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(review?.createTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-0.5">{getRatingStars(review?.starRating)}</div>
          </div>
        </div>
        {/* Review Content */}
        <div className="flex-grow flex flex-col">
          <div className="bg-[#F0EDE0]/0 rounded-sm mb-3 backdrop-blur-sm">
            <div className="relative">
              <p
                className={`text-foreground leading-relaxed text-sm transition-all duration-300 ${
                  expandedReviews[review?.reviewId] ? '' : 'line-clamp-3'
                }`}
              >
                {review?.comment ? review?.comment : 'No comment'}
              </p>
              {review?.comment && review?.comment?.length > 150 && (
                <button
                  onClick={() => toggleReviewExpand(review?.reviewId)}
                  className="mt-2 text-sm text-primary font-medium flex items-center hover:text-foreground transition-colors"
                >
                  {expandedReviews[review?.reviewId] ? (
                    <>
                      <span>Show less</span>
                      <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      <span>Read more</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          {/* Action Section */}
          <div className="pt-2 text-xs border-t border-background">
            {review?.reviewReply ? (
              <div className="space-y-2">
                <button
                  onClick={() => toggleReplyExpand(review?.reviewId)}
                  className="w-full text-left group"
                >
                  <div className="flex items-center justify-between transition-colors">
                    <div className="flex items-center text-xs text-primary font-medium">
                      <span>{review?.reviewReply.aiGenerated ? '✨ AI Reply' : 'Show Reply'}</span>
                    </div>
                    {expandedReplies[review?.reviewId] ? (
                      <ChevronUp className="w-4 h-4 text-primary" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </button>
                {expandedReplies[review?.reviewId] && (
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-md p-4 border-l-4 border-primary backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-foreground/60">
                        {new Date(review?.reviewReply.updateTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-foreground leading-relaxed text-xs">
                      {review?.reviewReply?.comment?.length > 100
                        ? `${review?.reviewReply?.comment.slice(0, 100)}...`
                        : review?.reviewReply?.comment}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-sm p-4 border-l-4 border-amber-400">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">Awaiting Response</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-[#D1D9D8] hover:bg-gray-50 flex-1 bg-transparent"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Mark Read
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary to-foreground hover:from-foreground hover:to-primary text-white text-xs flex-1 hover:shadow-lg transition-shadow duration-400"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <div className="flex space-x-2">
          <Download className="w-5 h-5 text-foreground/40 cursor-pointer hover:text-foreground" />
          <MoreHorizontal className="w-5 h-5 text-foreground/40 cursor-pointer hover:text-foreground" />
        </div>
      </div>

      {recentReviews.length > 0 ? (
        <div className="pb-10">
          <div className="grid grid-cols-2 gap-4">
            {recentReviews.map((review) => renderReviewCard(review))}
          </div>
          <div className="flex items-center justify-center mt-6">
            <Link
              href="/reviews/all"
              className="rounded-full bg-primary px-10 py-3 text-center mx-auto text-white hover:shadow-xl hover:shadow-primary/15"
            >
              <span className="">View All Reviews</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center border- border-chart-1/80 shadow-chart-1/15 text-foreground/60">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
            <p className="text-base font-medium">No recent reviews</p>
            <p className="text-xs text-foreground/40 mt-1">Reviews will appear here</p>
          </div>
        </div>
      )}
    </>
  );
}
