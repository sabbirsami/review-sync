'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, CheckCircle, Clock, RefreshCw, Search, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Review {
  reviewId: string;
  businessProfileName: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl: string;
  };
  starRating: string;
  comment: string;
  createTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
    aiGenerated?: boolean;
  };
  replyStatus: string;
  sentimentScore?: number;
}

export default function AllReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [filterProfile, setFilterProfile] = useState('all');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '50',
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterRating !== 'all' && { rating: filterRating }),
        ...(filterProfile !== 'all' && { profileId: filterProfile }),
      });

      const response = await fetch(`/api/reviews?${params}`);
      const data = await response.json();

      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filterStatus, filterRating, filterProfile]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'ignored':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'replied':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'ignored':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

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
        className={`w-4 h-4 ${i < numRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getSentimentColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 0.7) return 'bg-green-100 text-green-800';
    if (score >= 0.4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSentimentLabel = (score?: number) => {
    if (!score) return 'Unknown';
    if (score >= 0.7) return 'Positive';
    if (score >= 0.4) return 'Neutral';
    return 'Negative';
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Reviews</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all customer reviews across your business profiles
          </p>
        </div>
        <Button onClick={fetchReviews}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="ignored">Ignored</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="FIVE">5 Stars</SelectItem>
                <SelectItem value="FOUR">4 Stars</SelectItem>
                <SelectItem value="THREE">3 Stars</SelectItem>
                <SelectItem value="TWO">2 Stars</SelectItem>
                <SelectItem value="ONE">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterProfile} onValueChange={setFilterProfile}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Profiles</SelectItem>
                <SelectItem value="profile_1">Main Branch</SelectItem>
                <SelectItem value="profile_2">Downtown</SelectItem>
                <SelectItem value="profile_3">Mall Branch</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterRating('all');
                setFilterProfile('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.reviewId} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={review.reviewer.profilePhotoUrl || '/placeholder.svg?height=48&width=48'}
                    alt={review.reviewer.displayName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{review.reviewer.displayName}</h4>
                    <p className="text-sm text-gray-600">{review.businessProfileName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex">{getRatingStars(review.starRating)}</div>
                  <Badge className={getStatusColor(review.replyStatus)}>
                    {getStatusIcon(review.replyStatus)}
                    <span className="ml-1">{review.replyStatus}</span>
                  </Badge>
                  {review.sentimentScore && (
                    <Badge className={getSentimentColor(review.sentimentScore)}>
                      {getSentimentLabel(review.sentimentScore)}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-800 leading-relaxed">{review.comment}</p>
              </div>

              {review.reviewReply ? (
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      {review.reviewReply.aiGenerated ? 'AI Generated Reply' : 'Manual Reply'}
                    </span>
                    <span className="text-xs text-gray-500">
                      • {new Date(review.reviewReply.updateTime).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.reviewReply.comment}</p>
                </div>
              ) : (
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Pending Reply</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Generate Reply
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
