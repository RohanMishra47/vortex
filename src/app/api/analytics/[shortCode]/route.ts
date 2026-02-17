import { prisma } from "@/utils/prismaClient";
import { NextResponse } from "next/server";

const THIRTY_DAYS_AGO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d;
};

// ─────────────────────────────────────────────────────────────
// GET /api/analytics/[shortCode]
// Returns aggregated analytics for a specific short link
// ─────────────────────────────────────────────────────────────
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shortCode: string }> },
) {
  const { shortCode } = await params;

  try {
    // Fetch link + total clicks together
    const link = await prisma.link.findUnique({
      where: { shortCode },
      include: { _count: { select: { clicks: true } } },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Parallelize all analytics queries for faster response time
    const [
      clicksOverTime,
      topCountries,
      deviceStats,
      browserStats,
      topReferrers,
    ] = await Promise.all([
      prisma.$queryRaw<Array<{ date: string; clicks: number }>>`
        SELECT DATE("clickedAt") as date, COUNT(*)::int as clicks
        FROM "Click"
        WHERE "shortCode" = ${shortCode}
          AND "clickedAt" >= ${THIRTY_DAYS_AGO()}
        GROUP BY DATE("clickedAt")
        ORDER BY date ASC`,

      prisma.click.groupBy({
        by: ["country"],
        where: { shortCode, NOT: { country: null } },
        _count: { country: true },
        orderBy: { _count: { country: "desc" } },
        take: 10,
      }),

      prisma.click.groupBy({
        by: ["device"],
        where: { shortCode, NOT: { device: null } },
        _count: { device: true },
      }),

      prisma.click.groupBy({
        by: ["browser"],
        where: { shortCode, NOT: { browser: null } },
        _count: { browser: true },
        orderBy: { _count: { browser: "desc" } },
        take: 10,
      }),

      prisma.click.groupBy({
        by: ["referrer"],
        where: { shortCode, NOT: { referrer: null } },
        _count: { referrer: true },
        orderBy: { _count: { referrer: "desc" } },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      shortCode,
      url: link.url,
      totalClicks: link._count.clicks,
      createdAt: link.createdAt,
      analytics: {
        clicksOverTime,
        topCountries: topCountries.map(({ country, _count }) => ({
          country,
          clicks: _count.country,
        })),
        devices: deviceStats.map(({ device, _count }) => ({
          device,
          clicks: _count.device,
        })),
        browsers: browserStats.map(({ browser, _count }) => ({
          browser,
          clicks: _count.browser,
        })),
        topReferrers: topReferrers.map(({ referrer, _count }) => ({
          referrer,
          clicks: _count.referrer,
        })),
      },
    });
  } catch (error) {
    console.error("[GET /api/analytics] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
