// This file contains skeleton components for loading states in the dashboard.

// Card skeleton for the dashboard overview
export function SkeletonCard() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-700 rounded w-24"></div>
        <div className="h-5 w-5 bg-gray-700 rounded"></div>
      </div>
      <div className="h-8 bg-gray-700 rounded w-32 mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-20"></div>
    </div>
  );
}

// Link skeleton for the links list
export function SkeletonLink() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-6 bg-gray-700 rounded w-24"></div>
            <div className="h-5 bg-gray-700 rounded-full w-16"></div>
          </div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-32"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-9 bg-gray-700 rounded-lg"></div>
          <div className="h-9 w-9 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

// Chart skeleton for the analytics page
export function SkeletonChart() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
      <div className="h-6 bg-gray-700 rounded w-48 mb-6 animate-pulse"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-20"></div>
            <div className="flex-1 h-2 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-12"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
