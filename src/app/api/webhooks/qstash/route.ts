// app/api/webhooks/qstash/route.ts
import { ClickData } from "@/utils/analytics";
import { prisma } from "@/utils/prismaClient";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * POST /api/webhooks/qstash
 *
 * This endpoint receives webhook calls from QStash, which are triggered by our publishMessage function when a click event occurs. It processes the incoming click data and saves it to the database using Prisma.
 *
 * Workflow:
 * 1. QStash calls this endpoint with click data
 * 2. This handler receives and parses the click data
 * 3. It saves the click data to the database using Prisma
 *
 * Security: In production, it verifies QStash signatures to prevent unauthorized requests.
 */

async function handler(request: Request) {
  try {
    const analyticsData: ClickData = await request.json();

    console.log("[Analytics Webhook] Received click data:", {
      shortCode: analyticsData.shortCode,
      country: analyticsData.country,
      device: analyticsData.device,
    });

    if (!analyticsData.shortCode || !analyticsData.clickedAt) {
      return NextResponse.json(
        { error: "Missing required fields: shortCode or clickedAt" },
        { status: 400 },
      );
    }

    await prisma.click.create({
      data: {
        shortCode: analyticsData.shortCode,
        clickedAt: new Date(analyticsData.clickedAt),
        country: analyticsData.country,
        city: analyticsData.city,
        device: analyticsData.device,
        browser: analyticsData.browser,
        os: analyticsData.os,
        referrer: analyticsData.referrer,
        ipHash: analyticsData.ipHash,
      },
    });

    console.log("[Analytics Webhook] Click saved to database successfully");

    return NextResponse.json(
      { success: true, message: "Analytics processed" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Analytics Webhook] Error processing analytics:", error);

    return NextResponse.json(
      { error: "Failed to process analytics", details: String(error) },
      { status: 500 },
    );
  }
}

export const POST =
  process.env.NODE_ENV === "production"
    ? verifySignatureAppRouter(handler)
    : handler;

// GET endpoint for health checks
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "QStash webhook endpoint is active",
  });
}
