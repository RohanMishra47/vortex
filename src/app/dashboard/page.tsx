"use client";

import axios from "axios";
import {
  AlertCircle,
  BarChart3,
  Link as LinkIcon,
  RefreshCw,
  Zap,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { SkeletonCard, SkeletonLink } from "../components/Skeleton";
import CreateLinkForm from "./components/CreateLinkForm";
import LinksList from "./components/LinksList";
import StatCard from "./components/StatCard";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// Define the Link type for better type safety
interface Link {
  id: string;
  shortCode: string;
  clickCount: number;
}

export default function DashboardPage() {
  const {
    data: links,
    error,
    mutate,
    isLoading,
  } = useSWR("/api/links", fetcher, {
    refreshInterval: 5000, // Auto-refresh every 5 seconds
  });

  const handleLinkCreated = () => {
    mutate(); // Refresh the links list
  };

  const handleDelete = async (shortCode: string) => {
    try {
      await axios.delete(`/api/links/${shortCode}`);
      mutate(); // Refresh the links list after deletion
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  // Calculate stats
  const totalLinks = links?.length || 0;
  const totalClicks =
    links?.reduce((sum: number, link: Link) => sum + link.clickCount, 0) || 0;
  const avgClicksPerLink =
    totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Manage your short links and track analytics
          </p>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Failed to Load Data
          </h2>
          <p className="text-gray-400 mb-4">
            We couldn&apos;t load your links. Please check your connection and
            try again.
          </p>
          <button
            onClick={() => mutate()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Manage your short links and track analytics
        </p>
      </div>

      {/* Overview Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Links"
            value={totalLinks}
            icon={LinkIcon}
            subtitle="All short links"
          />
          <StatCard
            title="Total Clicks"
            value={totalClicks.toLocaleString()}
            icon={BarChart3}
            subtitle="Across all links"
          />
          <StatCard
            title="Avg. Clicks/Link"
            value={avgClicksPerLink}
            icon={Zap}
            subtitle="Performance metric"
          />
        </div>
      )}

      {/* Create Link Form */}
      <CreateLinkForm onLinkCreated={handleLinkCreated} />

      {/* Links List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Your Links</h2>
          {isLoading && (
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <SkeletonLink />
            <SkeletonLink />
            <SkeletonLink />
          </div>
        ) : (
          <>
            <LinksList links={links || []} onDelete={handleDelete} />

            {/* View Analytics Links */}
            {links && links.length > 0 && (
              <div className="mt-6 p-4 bg-purple-600/20 rounded-lg border border-purple-500/30">
                <p className="text-sm text-gray-300 mb-2">
                  💡 Click on any short code to view detailed analytics
                </p>
                <div className="flex flex-wrap gap-2">
                  {links.slice(0, 5).map((link: Link) => (
                    <Link
                      key={link.id}
                      href={`/dashboard/${link.shortCode}`}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                    >
                      /{link.shortCode} →
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
