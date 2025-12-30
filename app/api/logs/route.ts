import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const perPage = Number.parseInt(searchParams.get("per_page") || "20")
    const apiName = searchParams.get("api_name") || ""
    const method = searchParams.get("method") || ""
    const domain = searchParams.get("domain") || ""
    const searchTerm = searchParams.get("search") || ""

    // Build filter query
    const filter: any = {}

    // Add specific filters
    if (apiName) {
      filter.api_name = { $regex: apiName, $options: "i" }
    }
    if (method) {
      filter.method = method
    }
    if (domain) {
      filter.domain = { $regex: domain, $options: "i" }
    }

    // Add search term filter if provided
    if (searchTerm) {
      const searchRegex = { $regex: searchTerm, $options: "i" }
      
      filter.$or = [
        { api_name: searchRegex },
        { url: searchRegex },
        { request_payload_text: searchRegex },
        { response_text: searchRegex }
      ]
    }

    const db = await getDatabase()
    const collection = db.collection("logs")

    // Get total count
    const total = await collection.countDocuments(filter)

    // Get counts for different statuses
    const successCount = await collection.countDocuments({ ...filter, status: { $in: ["success", "200", "201"] } })
    const errorCount = await collection.countDocuments({
      ...filter,
      $or: [
        { status: { $regex: "failed", $options: "i" } },
        { status: { $gte: 400, $lt: 600 } }
      ]
    })
    const pendingCount = total - successCount - errorCount

    // Get paginated logs
    const logs = await collection
      .find(filter)
      .sort({ created_at: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray()

    // Transform MongoDB documents to match the Log interface
    const transformedLogs = logs.map((log) => ({
      id: log._id.toString(),
      domain: log.domain || null,
      api_name: log.api_name || null,
      method: log.method || null,
      url: log.url || null,
      request_payload: log.request_payload || null,
      response: log.response || null,
      status: log.status || null,
      error_message: log.error_message || null,
      created_at: log.created_at || log.createdAt || new Date().toISOString(),
      updated_at: log.updated_at || log.updatedAt || new Date().toISOString(),
    }))

    return NextResponse.json({
      data: transformedLogs,
      meta: {
        current_page: page,
        per_page: perPage,
        total,
        last_page: Math.ceil(total / perPage) || 1,
        stats: {
          total,
          success: successCount,
          errors: errorCount,
          pending: pendingCount
        }
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs from database" }, { status: 500 })
  }
}
