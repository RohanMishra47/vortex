import { Prisma } from "@/generated/prisma/client";
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
    const shortCode = generateShortCode();

    try {
      const link = await prisma.link.create({
        data: { shortCode, url },
      });

      await cacheLink(shortCode, url);

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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle unique constraint violations
        if (error.code === "P2002") {
          const target = error.meta?.target;

          if (!Array.isArray(target)) throw error;

          if (target?.includes("shortCode")) {
            console.error(`🚨 Short code collision on ${shortCode}`);
            const newShortCode = generateShortCode(); // Retry shortCode generation
            const link = await prisma.link.create({
              data: { shortCode: newShortCode, url },
            });
            await cacheLink(newShortCode, url);

            return NextResponse.json(
              {
                shortCode: link.shortCode,
                shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${link.shortCode}`,
                url: link.url,
                createdAt: link.createdAt,
              },
              { status: 201 },
            );
          }

          // If the URL already exists, return the existing short link
          if (target?.includes("url")) {
            const existingLink = await prisma.link.findUnique({
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
          }
        }
      }

      throw error;
    }
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
