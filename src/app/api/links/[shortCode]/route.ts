import { prisma } from "@/utils/prismaClient";
import { invalidateLink } from "@/utils/redisClient";
import { shortCodeSchema } from "@/utils/validation";
import { NextResponse } from "next/server";

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
