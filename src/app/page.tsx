import { BarChart3, Globe, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold mb-4 bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            ⚡ Vortex
          </h1>
          <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
            Lightning-fast URL shortener powered by edge computing
          </p>
          <p className="text-sm text-gray-400">
            Redirect users in &lt;50ms with globally distributed edge functions
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              Go to Dashboard
            </Link>
            <a
              href="https://github.com/RohanMishra47/vortex"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors border border-white/20"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Edge-Powered</h3>
            </div>
            <p className="text-sm text-gray-300">
              Redirects happen at the nearest data center, ensuring sub-50ms
              response times globally.
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-6 h-6 text-pink-400" />
              <h3 className="text-lg font-semibold text-white">Global Cache</h3>
            </div>
            <p className="text-sm text-gray-300">
              Redis cache distributed worldwide ensures your links are always
              fast, everywhere.
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">
                Real-Time Analytics
              </h3>
            </div>
            <p className="text-sm text-gray-300">
              Track clicks, locations, devices, and more without slowing down
              redirects.
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">
                Bot Filtering
              </h3>
            </div>
            <p className="text-sm text-gray-300">
              Automatically filters out bot traffic to keep your analytics
              accurate and meaningful.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="text-center p-6 bg-linear-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-lg rounded-lg border border-purple-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">Built With</h2>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
            <span>Next.js 16</span>
            <span>•</span>
            <span>Vercel Edge</span>
            <span>•</span>
            <span>PostgreSQL</span>
            <span>•</span>
            <span>Upstash Redis</span>
            <span>•</span>
            <span>Prisma ORM</span>
            <span>•</span>
            <span>Recharts</span>
          </div>
        </div>

        {/* Status */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p>All systems operational</p>
          </div>
          <p>Day 5: Dashboard UI Complete ✅</p>
        </div>
      </div>
    </main>
  );
}
