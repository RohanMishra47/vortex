import { prisma } from "@/utils/prismaClient";
import { shortCodeSchema } from "@/utils/validation";
import { NextResponse } from "next/server";

// This runs on Node.js runtime (can use Prisma)
export const runtime = "nodejs";

// GET /api/links/resolve/[shortCode]
// Internal API to resolve shortCode to URL from database
export async function GET(
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

    const link = await prisma.link.findUnique({
      where: { shortCode },
      select: { url: true },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ url: link.url });
  } catch (error) {
    console.error("[Resolve Link] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
