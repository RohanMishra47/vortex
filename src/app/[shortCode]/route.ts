import { extractAnalytics } from "@/utils/analytics";
import { publishMessage } from "@/utils/qstashClient";
import { cacheLink, getCachedLink } from "@/utils/redisClient";
import { shortCodeSchema } from "@/utils/validation";
import { isbot } from "isbot";
import { NextResponse } from "next/server";

// This runs on Vercel Edge Runtime
export const runtime = "edge";

// Disable caching for this route (handle caching via Redis)
export const dynamic = "force-dynamic";

// GET /[shortCode]
// Redirects user to the original URL with minimal latency,
// while asynchronously capturing analytics data via QStash.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> },
) {
  const { shortCode } = await params;

  const validation = shortCodeSchema.safeParse({ shortCode });
  if (!validation.success) {
    return NextResponse.redirect(new URL("/", request.url), { status: 302 });
  }

  try {
    // --- Step 1: Resolve the URL (cache-first) ---
    let resolvedUrl: string | null = await getCachedLink(shortCode);

    if (!resolvedUrl) {
      // Cache miss — fall back to the database via the Node.js API
      const apiUrl = new URL(`/api/links/resolve/${shortCode}`, request.url);
      const response = await fetch(apiUrl.toString());

      if (!response.ok) {
        return NextResponse.redirect(new URL("/", request.url), {
          status: 302,
        });
      }

      const { url } = await response.json();
      resolvedUrl = url;

      // Cache the resolved URL for future requests
      await cacheLink(shortCode, resolvedUrl!);
    }

    const userAgent = request.headers.get("user-agent") || "";

    // Filter out bots
    if (!isbot(userAgent)) {
      // --- Step 2: Extract analytics metadata (non-blocking) ---
      // extractAnalytics reads headers but does NOT write anything yet.
      const clickData = await extractAnalytics(shortCode, request);

      // --- Step 3: Queue analytics via QStash (fire-and-forget) ---
      // We send the clickData to a webhook that will process it asynchronously.
      // QStash will POST the clickData payload there 1-2 seconds later,
      // allowing us to keep the redirect response super fast.
      const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/qstash`;

      // We intentionally do NOT await this promise. We want the redirect to happen immediately,
      publishMessage(webhookUrl, clickData).catch((err) =>
        console.error("[Edge Redirect] QStash publish failed silently:", err),
      );
    }

    // --- Step 4: Redirect the user immediately ---
    // This response is sent right now, before QStash even receives the message.
    return NextResponse.redirect(resolvedUrl!, {
      status: 307,
      headers: {
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    console.error(`[Edge Redirect] Error for ${shortCode}:`, error);
    return NextResponse.redirect(new URL("/", request.url), { status: 302 });
  }
}
