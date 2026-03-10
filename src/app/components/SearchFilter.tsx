"use client";

import { Search, SortAsc, SortDesc, X } from "lucide-react";
import { useMemo, useState } from "react";
import { LinkItem } from "../types/link";

interface SearchFilterProps {
  links: LinkItem[];
  children: (filteredLinks: LinkItem[]) => React.ReactNode;
}

type SortOption = "recent" | "clicks" | "oldest";

export default function SearchFilter({ links, children }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const filteredAndSortedLinks = useMemo(() => {
    // Filter by search query
    const filtered = links.filter((link) => {
      const query = searchQuery.toLowerCase();
      return (
        link.shortCode.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query)
      );
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "clicks":
          return b.clickCount - a.clickCount;
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "recent":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return filtered;
  }, [links, searchQuery, sortBy]);

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by short code or URL..."
            className="w-full pl-10 pr-10 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none pl-10 pr-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
          >
            <option value="recent">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="clicks">Most Clicks</option>
          </select>
          {sortBy === "recent" || sortBy === "oldest" ? (
            sortBy === "recent" ? (
              <SortDesc className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            ) : (
              <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            )
          ) : (
            <SortDesc className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="text-sm text-gray-400">
          Found {filteredAndSortedLinks.length}{" "}
          {filteredAndSortedLinks.length === 1 ? "link" : "links"}
        </div>
      )}

      {/* Render filtered links */}
      {children(filteredAndSortedLinks)}
    </div>
  );
}
