'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewDocument } from '@/types/review';
import { Calendar, ChevronDown, ChevronUp, Clock, Eye, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function ReviewCard({ review }: { review: ReviewDocument }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplyExpanded, setIsReplyExpanded] = useState(false);

  const getRatingStars = (rating: string) => {
    const numRating =
      rating === 'ONE'
        ? 1
        : rating === 'TWO'
        ? 2
        : rating === 'THREE'
        ? 3
        : rating === 'FOUR'
        ? 4
        : 5;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < numRating ? 'fill-[#FBD686] text-[#FBD686]' : 'text-[#D1D9D8]'}`}
      />
    ));
  };

  return (
    <Card className="border-none bg-white flex flex-col overflow-hidden rounded-lg shadow-none hover:shadow-xl transition-shadow duration-300">
      <CardContent className="px-6 flex flex-col">
        {/* Header Section */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                {review?.reviewer?.profilePhotoUrl && !review?.reviewer?.profilePhotoUrl.includes('googleusercontent.com') ? (
                  <Image
                    src={review.reviewer.profilePhotoUrl}
                    alt={review?.reviewer?.displayName || 'Reviewer'}
                    width={32}
                    height={32}
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/avatar-placeholder.svg';
                      target.onerror = null;
                    }}
                  />
                ) : (
                  <img
                    src={review?.reviewer?.profilePhotoUrl || '/avatar-placeholder.svg'}
                    alt={review?.reviewer?.displayName || 'Reviewer'}
                    width={32}
                    height={32}
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/avatar-placeholder.svg';
                      target.onerror = null;
                    }}
                  />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground text-sm">
                  {review?.reviewer?.displayName?.length > 20
                    ? `${review?.reviewer?.displayName.slice(0, 20)}...`
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
                  isExpanded ? '' : 'line-clamp-3'
                }`}
              >
                {review?.comment ? review?.comment : 'No comment provided'}
              </p>
              {review?.comment && review?.comment?.length > 150 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-sm text-primary font-medium flex items-center hover:text-foreground transition-colors"
                >
                  {isExpanded ? (
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
                  onClick={() => setIsReplyExpanded(!isReplyExpanded)}
                  className="w-full text-left group"
                >
                  <div className="flex items-center justify-between transition-colors">
                    <div className="flex items-center text-xs text-primary font-medium">
                      <span>{review?.reviewReply?.aiGenerated ? '✨ AI Reply' : 'Show Reply'}</span>
                    </div>
                    {isReplyExpanded ? (
                      <ChevronUp className="w-4 h-4 text-primary" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </button>
                {isReplyExpanded && (
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-md p-4 border-l-4 border-primary backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-foreground/60">
                        {new Date(review?.reviewReply?.updateTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-foreground leading-relaxed text-xs">
                      {review?.reviewReply?.comment?.length > 100
                        ? `${review?.reviewReply?.comment?.slice(0, 100)}...`
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
                      className="bg-gradient-to-r from-primary to-foreground hover:from-foreground hover:to-primary text-white text-xs flex-1 shadow-lg"
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
}
