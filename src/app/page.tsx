export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-white mb-4">⚡ Vortex</h1>
        <p className="text-xl text-gray-300 max-w-2xl">
          Lightning-fast URL shortener powered by edge computing
        </p>
        <p className="text-sm text-gray-400">Foundation Complete ✅</p>

        <div className="mt-8 p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Status Check
          </h2>
          <div className="space-y-2 text-left text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Next.js 16 initialized</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>PostgreSQL connected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Upstash Redis configured</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Prisma schema ready</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
