import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Review } from "@/types/review"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()

    // Transform the n8n review data
    const review: Review = {
      reviewId: body.reviewId,
      businessProfileId: extractProfileId(body.name),
      businessProfileName: getProfileName(body.name),
      reviewer: body.reviewer,
      starRating: body.starRating,
      comment: body.comment,
      createTime: body.createTime,
      updateTime: body.updateTime,
      reviewReply: body.reviewReply,
      replyStatus: body.reviewReply ? "replied" : "pending",
      name: body.name,
    }

    // Upsert the review (update if exists, insert if new)
    await db.collection("reviews").replaceOne({ reviewId: review.reviewId }, review, { upsert: true })

    return NextResponse.json({ success: true, message: "Review processed" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Failed to process review" }, { status: 500 })
  }
}

function extractProfileId(name: string): string {
  const match = name.match(/locations\/(\d+)/)
  return match ? match[1] : "unknown"
}

function getProfileName(name: string): string {
  // You can maintain a mapping of profile IDs to names
  const profileNames: Record<string, string> = {
    "11832958934823586542": "Cardamom Restaurant",
    // Add other profiles
  }
  const profileId = extractProfileId(name)
  return profileNames[profileId] || `Profile ${profileId}`
}
