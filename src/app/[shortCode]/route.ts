import { cacheLink, getCachedLink } from "@/utils/redisClient";
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
    // Invalid short code format - redirect to homepage
    return NextResponse.redirect(new URL("/", request.url), {
      status: 302, // Temporary redirect
    });
  }

  try {
    const cachedUrl = await getCachedLink(shortCode);

    if (cachedUrl) {
      // Cache hit! Redirect immediately
      return NextResponse.redirect(cachedUrl, {
        status: 307,
        headers: {
          "Cache-Control": "public, max-age=60",
        },
      });
    }

    // Cache miss - Call Node.js API to fetch from database
    const apiUrl = new URL(`/api/links/resolve/${shortCode}`, request.url);
    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      // Link not found - redirect to homepage
      return NextResponse.redirect(new URL("/", request.url), {
        status: 302,
      });
    }
    const { url } = await response.json();

    // Cache the URL in Redis for next time
    await cacheLink(shortCode, url);

    // Redirect to original URL
    return NextResponse.redirect(url, {
      status: 307,
      headers: {
        "Cache-Control": "public, max-age=60",
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
