import { customAlphabet } from "nanoid";

const alphabet = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
const generateId = customAlphabet(alphabet, 7);

export function generateShortCode(): string {
  return generateId();
}
