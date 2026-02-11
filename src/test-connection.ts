import { prisma } from "./clients/prismaClient";
import { redis } from "./clients/redisClient";

async function testConnections() {
  console.log("🔍 Testing database connection...");

  try {
    // Test PostgreSQL
    await prisma.$connect();
    console.log("✅ PostgreSQL connected successfully!");

    // Test Redis
    await redis.set("test-key", "Hello Vortex!");
    const value = await redis.get("test-key");
    console.log(`✅ Redis connected successfully! Test value: ${value}`);

    await redis.del("test-key");

    console.log("\n🎉 All connections working!");
  } catch (error) {
    console.error("❌ Connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnections();
