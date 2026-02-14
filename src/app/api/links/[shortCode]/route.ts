import { prisma } from "@/utils/prismaClient";
import { invalidateLink, redis } from "@/utils/redisClient";
import { shortCodeSchema } from "@/utils/validation";
import { NextResponse } from "next/server";

// This runs on Vercel Edge Runtime
export const runtime = "edge";

// Disable caching for this route (handle caching via Redis)
export const dynamic = "force-dynamic";

// GET /[shortCode]
// Redirects user to the original URL with minimal latency
export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> },
) {
  const { shortCode } = await params;

  const validation = shortCodeSchema.safeParse({ shortCode });
  if (!validation.success) {
    return NextResponse.redirect(new URL("/404", request.url));
  }

  try {
    const cachedUrl = await redis.get<string>(`link:${shortCode}`);

    if (cachedUrl) {
      // Cache hit! Redirect immediately
      return NextResponse.redirect(cachedUrl, {
        status: 301,
        headers: {
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // Cache miss - Query PostgreSQL
    const link = await prisma.link.findUnique({
      where: { shortCode },
      select: { url: true },
    });

    if (!link) {
      return NextResponse.redirect(new URL("/404", request.url));
    }

    // Cache the URL in Redis for next time
    await redis.set(`link:${shortCode}`, link.url, {
      ex: 60 * 60 * 24 * 30, // Cache for 30 days
    });

    // Redirect to original URL
    return NextResponse.redirect(link.url, {
      status: 301,
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error(`[Edge Redirect] Error for ${shortCode}:`, error);

    // Redirect to homepage
    return NextResponse.redirect(new URL("/", request.url), {
      status: 302,
    });
  }
}

// DELETE /api/links/[shortCode]
// Deletes a short link + invalidates Redis cache
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> },
) {
  try {
    const { shortCode } = await params;

    const validation = shortCodeSchema.safeParse({ shortCode });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid short code" },
        { status: 400 },
      );
    }

    // Check if link exists before deleting
    const existing = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (!existing) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Delete from PostgreSQL (cascades to clicks table automatically)
    await prisma.link.delete({
      where: { shortCode },
    });

    // Immediately invalidate Redis cache
    // This ensures the link stops working globally right away
    invalidateLink(shortCode);

    return NextResponse.json(
      { message: `Link ${shortCode} deleted successfully` },
      { status: 200 },
    );
  } catch (error) {
    console.error("[DELETE /api/links/[shortCode]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
