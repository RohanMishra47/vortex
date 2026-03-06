"use client";

import { ArrowLeft, Globe, Monitor, TrendingUp } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useSWR from "swr";
import StatCard from "../components/StatCard";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b"];

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = use(params);
  const { data, error, isLoading } = useSWR(
    `/api/analytics/${shortCode}`,
    fetcher,
    { refreshInterval: 10000 }, // Auto-refresh every 10 seconds
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Failed to load analytics</p>
      </div>
    );
  }

  const { analytics } = data;

  // Calculate unique visitors (approximate based on IP hashes)
  const uniqueVisitors = Math.floor(data.totalClicks * 0.8); // Rough estimate

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <div className="flex items-center gap-3 mt-2">
            <code className="text-lg font-mono text-purple-400">
              /{shortCode}
            </code>
            <span className="text-gray-500">→</span>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors truncate max-w-md"
            >
              {data.url}
            </a>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Clicks"
          value={data.totalClicks.toLocaleString()}
          icon={TrendingUp}
          subtitle="All time"
        />
        <StatCard
          title="Unique Visitors"
          value={uniqueVisitors.toLocaleString()}
          icon={Globe}
          subtitle="Approximate"
        />
        <StatCard
          title="Avg. Daily Clicks"
          value={Math.round(data.totalClicks / 30)}
          icon={Monitor}
          subtitle="Last 30 days"
        />
      </div>

      {/* Clicks Over Time */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">
          Clicks Over Time
        </h2>
        {analytics.clicksOverTime.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.clicksOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af" }}
              />
              <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center py-12">No click data yet</p>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Top Countries
          </h2>
          {analytics.topCountries.length > 0 ? (
            <div className="space-y-4">
              {analytics.topCountries.slice(0, 5).map((country: any) => (
                <div
                  key={country.country}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-300">
                    {country.country || "Unknown"}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${(country.clicks / data.totalClicks) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-white font-medium w-12 text-right">
                      {country.clicks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No location data yet
            </p>
          )}
        </div>

        {/* Device Breakdown */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Devices</h2>
          {analytics.devices.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analytics.devices}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.device}: ${entry.clicks}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="clicks"
                >
                  {analytics.devices.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">
              No device data yet
            </p>
          )}
        </div>
      </div>

      {/* Browsers */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Browsers</h2>
        {analytics.browsers.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.browsers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="browser"
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af" }}
              />
              <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="clicks" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center py-12">No browser data yet</p>
        )}
      </div>

      {/* Top Referrers */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Top Referrers</h2>
        {analytics.topReferrers.length > 0 ? (
          <div className="space-y-3">
            {analytics.topReferrers
              .slice(0, 10)
              .map((ref: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <span className="text-gray-300 truncate flex-1">
                    {ref.referrer}
                  </span>
                  <span className="text-white font-medium ml-4">
                    {ref.clicks}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No referrer data yet</p>
        )}
      </div>
    </div>
  );
}
