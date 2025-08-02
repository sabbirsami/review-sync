import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { DashboardStats } from "@/types/review"

export async function GET() {
  try {
    const db = await getDatabase()
    const reviews = db.collection("reviews")

    // Get basic stats
    const totalReviews = await reviews.countDocuments()
    const pendingReplies = await reviews.countDocuments({ replyStatus: "pending" })
    const repliedReviews = await reviews.countDocuments({ replyStatus: "replied" })
    const responseRate = totalReviews > 0 ? Math.round((repliedReviews / totalReviews) * 100) : 0

    // Calculate average rating
    const ratingPipeline = [
      {
        $addFields: {
          numericRating: {
            $switch: {
              branches: [
                { case: { $eq: ["$starRating", "ONE"] }, then: 1 },
                { case: { $eq: ["$starRating", "TWO"] }, then: 2 },
                { case: { $eq: ["$starRating", "THREE"] }, then: 3 },
                { case: { $eq: ["$starRating", "FOUR"] }, then: 4 },
                { case: { $eq: ["$starRating", "FIVE"] }, then: 5 },
              ],
              default: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$numericRating" },
        },
      },
    ]

    const ratingResult = await reviews.aggregate(ratingPipeline).toArray()
    const averageRating = ratingResult[0]?.averageRating || 0

    // Get review trends (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const trendsPipeline = [
      {
        $match: {
          createTime: { $gte: sixMonthsAgo.toISOString() },
        },
      },
      {
        $addFields: {
          month: {
            $dateToString: {
              format: "%Y-%m",
              date: { $dateFromString: { dateString: "$createTime" } },
            },
          },
        },
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]

    const trendsResult = await reviews.aggregate(trendsPipeline).toArray()
    const reviewTrends = trendsResult.map((item) => ({
      month: item._id,
      count: item.count,
    }))

    // Get rating distribution
    const distributionPipeline = [
      {
        $addFields: {
          numericRating: {
            $switch: {
              branches: [
                { case: { $eq: ["$starRating", "ONE"] }, then: 1 },
                { case: { $eq: ["$starRating", "TWO"] }, then: 2 },
                { case: { $eq: ["$starRating", "THREE"] }, then: 3 },
                { case: { $eq: ["$starRating", "FOUR"] }, then: 4 },
                { case: { $eq: ["$starRating", "FIVE"] }, then: 5 },
              ],
              default: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: "$numericRating",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]

    const distributionResult = await reviews.aggregate(distributionPipeline).toArray()
    const ratingDistribution = distributionResult.map((item) => ({
      rating: item._id,
      count: item.count,
    }))

    const stats: DashboardStats = {
      totalReviews,
      pendingReplies,
      averageRating: Math.round(averageRating * 10) / 10,
      responseRate,
      reviewTrends,
      ratingDistribution,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
