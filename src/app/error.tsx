"use client";

import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-8">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-400 mb-6">
            We encountered an unexpected error. Don&apos;t worry, it&apos;s not
            your fault!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors border border-white/20 inline-flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="bg-black/30 rounded-lg border border-white/10 p-4 text-left">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
              Error Details (Development Only)
            </summary>
            <pre className="mt-3 text-xs text-gray-500 overflow-auto">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
