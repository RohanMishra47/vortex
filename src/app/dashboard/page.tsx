"use client";

import axios from "axios";
import { BarChart3, Link as LinkIcon, Zap } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Failed to load links</p>
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

      {/* Create Link Form */}
      <CreateLinkForm onLinkCreated={handleLinkCreated} />

      {/* Links List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Your Links</h2>
          {!links && (
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {links ? (
          <>
            <LinksList links={links} onDelete={handleDelete} />

            {/* View Analytics Links */}
            {links.length > 0 && (
              <div className="mt-6 p-4 bg-purple-600/20 rounded-lg border border-purple-500/30">
                <p className="text-sm text-gray-300 mb-2">
                  💡 Click on any link&apos;s short code to view detailed
                  analytics
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
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}
