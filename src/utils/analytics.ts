import { headers } from "next/headers";

// Interface for click analytics data
export interface ClickData {
  shortCode: string;
  clickedAt: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  referrer?: string;
  ipHash?: string;
}

async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Extracts analytics data from the request
// Uses Next.js headers() which works in both Edge and Node runtimes
export async function extractAnalytics(
  shortCode: string,
  request: Request,
): Promise<ClickData> {
  const headersList = await headers();

  // Extract User-Agent
  const userAgent = request.headers.get("user-agent") || "";

  // Extract referrer (where the user came from)
  const referrer =
    request.headers.get("referer") ||
    request.headers.get("referrer") ||
    "Direct";

  // Extract IP address
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";

  // Hash IP for privacy
  const ipHash = ip !== "unknown" ? await hashIp(ip) : undefined;

  // Extract geographic data from Vercel/Cloudflare headers
  const country =
    headersList.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    process.env.DEV_COUNTRY ||
    undefined;

  const city =
    headersList.get("x-vercel-ip-city") ||
    request.headers.get("cf-ipcity") ||
    process.env.DEV_CITY ||
    undefined;

  // Parse device type from User-Agent
  const device = getDeviceType(userAgent);

  // Parse browser from User-Agent
  const browser = getBrowser(userAgent);

  // Parse OS from User-Agent
  const os = getOS(userAgent);

  return {
    shortCode,
    clickedAt: new Date().toISOString(),
    country,
    city,
    device,
    browser,
    os,
    referrer,
    ipHash,
  };
}

// Determines device type from User-Agent string
function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

// Determines browser from User-Agent string
function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (ua.includes("edg/") || ua.includes("edge/")) return "Edge";
  if (ua.includes("chrome/") && !ua.includes("edg")) return "Chrome";
  if (ua.includes("safari/") && !ua.includes("chrome")) return "Safari";
  if (ua.includes("firefox/")) return "Firefox";
  if (ua.includes("opera/") || ua.includes("opr/")) return "Opera";
  if (ua.includes("msie") || ua.includes("trident/")) return "IE";

  return "Other";
}

// Determines operating system from User-Agent string
function getOS(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (ua.includes("win")) return "Windows";
  if (ua.includes("mac")) return "macOS";
  if (ua.includes("iphone") || ua.includes("ipad")) return "iOS";
  if (ua.includes("android")) return "Android";
  if (ua.includes("linux")) return "Linux";
  if (ua.includes("cros")) return "ChromeOS";

  return "Other";
}
