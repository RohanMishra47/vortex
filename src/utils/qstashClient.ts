import { Client } from "@upstash/qstash";
import { ClickData } from "./analytics";

if (!process.env.QSTASH_TOKEN) {
  throw new Error("QSTASH_TOKEN is not defined in environment variables");
}

// Initialize QStash client
export const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN,
});

/**
 * Publishes a message to QStash for async processing
 * @param url - The webhook URL to call
 * @param body - The data to send
 */
export async function publishMessage(url: string, body: ClickData) {
  try {
    const response = await qstashClient.publishJSON({
      url,
      body,
    });

    console.log("[QStash] Message published:", response.messageId);
    return response;
  } catch (error) {
    console.error("[QStash] Failed to publish message:", error);
    throw error;
  }
}
