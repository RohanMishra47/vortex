import { prisma } from "@/utils/prismaClient";
import { customAlphabet } from "nanoid";

const alphabet = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
const generateId = customAlphabet(alphabet, 7);

export async function generateShortCode(): Promise<string> {
  const MAX_RETRIES = 5;

  for (let attemp = 0; attemp < MAX_RETRIES; attemp++) {
    const shortCode = generateId();

    const existing = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (!existing) {
      return shortCode;
    }

    console.warn(
      `Short code collison detected: ${shortCode}. Retrying... (attempt ${attemp + 1})`,
    );
  }

  throw new Error(
    "Failed to generate unique short code after maximum retries.",
  );
}
