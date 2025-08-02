import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const rating = searchParams.get("rating")
    const profileId = searchParams.get("profileId")

    const db = await getDatabase()
    const reviews = db.collection("reviews")

    // Build filter
    const filter: any = {}
    if (status && status !== "all") {
      filter.replyStatus = status
    }
    if (rating && rating !== "all") {
      filter.starRating = rating.toUpperCase()
    }
    if (profileId && profileId !== "all") {
      filter.businessProfileId = profileId
    }

    // Get total count for pagination
    const total = await reviews.countDocuments(filter)

    // Get reviews with pagination
    const reviewsList = await reviews
      .find(filter)
      .sort({ createTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      reviews: reviewsList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Reviews API error:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
