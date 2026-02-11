import { prisma } from "@/utils/prismaClient";
import { cacheLink } from "@/utils/redisClient";
import { generateShortCode } from "@/utils/shortCodeID";
import { createLinkSchema } from "@/utils/validation";
import { NextResponse } from "next/server";

// POST /api/links
// Creates a new short link
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = createLinkSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { url } = validation.data;

    // Check if this exact URL already exists
    const existingLink = await prisma.link.findFirst({
      where: { url },
    });

    if (existingLink) {
      return NextResponse.json(
        {
          shortCode: existingLink.shortCode,
          shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${existingLink.shortCode}`,
          url: existingLink.url,
          createdAt: existingLink.createdAt,
          message: "Short link already exists for this URL",
        },
        { status: 200 },
      );
    }

    const shortCode = await generateShortCode();

    const link = await prisma.link.create({
      data: {
        shortCode,
        url,
      },
    });

    // 6. Cache in Redis (so edge function can redirect instantly)
    cacheLink(shortCode, url);

    return NextResponse.json(
      {
        shortCode: link.shortCode,
        shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${link.shortCode}`,
        url: link.url,
        createdAt: link.createdAt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/links] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET /api/links
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
    });

    // Format the response to include the full short URL and click count
    const formattedLinks = links.map((link) => ({
      id: link.id,
      shortCode: link.shortCode,
      shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${link.shortCode}`,
      url: link.url,
      clickCount: link._count.clicks,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    }));

    return NextResponse.json(formattedLinks, { status: 200 });
  } catch (error) {
    console.error("[GET /api/links] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
