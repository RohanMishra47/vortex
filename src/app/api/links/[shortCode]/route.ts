import { prisma } from "@/utils/prismaClient";
import { invalidateLink } from "@/utils/redisClient";
import { shortCodeSchema } from "@/utils/validation";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { shortCode: string } },
) {
  try {
    // Validate short code
    const validation = shortCodeSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid short code" },
        { status: 400 },
      );
    }

    const { shortCode } = validation.data;

    const link = await prisma.link.findUnique({
      where: { shortCode },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: link.id,
      shortCode: link.shortCode,
      shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${link.shortCode}`,
      url: link.url,
      clickCount: link._count.clicks,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    });
  } catch (error) {
    console.error("[GET /api/links/[shortCode]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/links/[shortCode]
// Deletes a short link + invalidates Redis cache
export async function DELETE(
  request: Request,
  { params }: { params: { shortCode: string } },
) {
  try {
    const validation = shortCodeSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid short code" },
        { status: 400 },
      );
    }

    const { shortCode } = validation.data;

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
