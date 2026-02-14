export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-white mb-4 bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text">
            ⚡ Vortex
          </h1>
          <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
            Lightning-fast URL shortener powered by edge computing
          </p>
          <p className="text-sm text-gray-400">
            Redirect users in &lt;50ms with globally distributed edge functions
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Day 1 */}
          <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-3">Day 1 ✅</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Next.js 16 setup</li>
              <li>• PostgreSQL + Prisma</li>
              <li>• Upstash Redis</li>
            </ul>
          </div>

          {/* Day 2 */}
          <div className="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-3">Day 2 ✅</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Link creation API</li>
              <li>• Short code generator</li>
              <li>• Cache-first storage</li>
            </ul>
          </div>

          {/* Day 3 */}
          <div className="p-6 bg-purple-600/20 backdrop-blur-lg rounded-lg border border-purple-500/50">
            <h3 className="text-lg font-semibold text-white mb-3">Day 3 🚀</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Edge redirection</li>
              <li>• Sub-50ms response</li>
              <li>• Custom 404 page</li>
            </ul>
          </div>
        </div>

        {/* Quick Test Instructions */}
        <div className="p-8 bg-linear-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-lg border border-purple-500/30">
          <h2 className="text-2xl font-semibold text-white mb-4">
            🧪 Test the Edge Function
          </h2>

          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">
                1. Create a short link:
              </p>
              <code className="text-green-400 text-sm">
                curl -X POST http://localhost:3000/api/links \<br />
                &nbsp;&nbsp;-H &quot;Content-Type: application/json&quot; \
                <br />
                &nbsp;&nbsp;-d {`'{"url": "https://www.google.com"}'`}
              </code>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">
                2. Click the short link:
              </p>
              <code className="text-blue-400 text-sm">
                http://localhost:3000/[your-short-code]
              </code>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">
                3. Try an invalid code:
              </p>
              <code className="text-red-400 text-sm">
                http://localhost:3000/invalid123
              </code>
              <p className="text-xs text-gray-500 mt-2">
                → Should show custom 404 page
              </p>
            </div>
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="text-center text-sm text-gray-500">
          <p>Edge Runtime • Redis Cache • PostgreSQL • Global CDN</p>
        </div>
      </div>
    </main>
  );
}
