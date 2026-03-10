"use client";

import { LinkItem } from "@/app/types/link";
import { formatDistanceToNow } from "date-fns";
import {
  Check,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  Loader2,
  Trash2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface LinksListProps {
  links: LinkItem[];
  onDelete: (shortCode: string) => void;
}

export default function LinksList({ links, onDelete }: LinksListProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const copyToClipboard = async (shortUrl: string, shortCode: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedCode(shortCode);
      toast.success("Copied to clipboard!", {
        description: shortUrl,
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error("Failed to copy", {
        description: "Please try again",
      });
    }
  };

  const handleDelete = async (shortCode: string, url: string) => {
    setDeletingCode(shortCode);

    try {
      await onDelete(shortCode);
      toast.success("Link deleted", {
        description: `Deleted: ${url.substring(0, 50)}...`,
      });
    } catch {
      toast.error("Failed to delete link", {
        description: "Please try again",
      });
    } finally {
      setDeletingCode(null);
    }
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <LinkIcon className="w-16 h-16 text-gray-600 mx-auto" />
        </div>
        <p className="text-gray-400 text-lg mb-2">No links yet</p>
        <p className="text-gray-500 text-sm">
          Create your first short link above!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <div
          key={link.id}
          className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6 hover:bg-white/12 transition-all group"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Link Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <Link
                  href={`/dashboard/${link.shortCode}`}
                  className="text-lg font-mono font-bold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  /{link.shortCode}
                </Link>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {link.clickCount} {link.clickCount === 1 ? "click" : "clicks"}
                </span>
              </div>

              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-white flex items-center gap-2 group/link truncate"
              >
                <span className="truncate">{link.url}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
              </a>

              <p className="text-xs text-gray-500 mt-2">
                Created{" "}
                {formatDistanceToNow(new Date(link.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* View Analytics Button */}
              <Link
                href={`/dashboard/${link.shortCode}`}
                className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="View analytics"
              >
                <TrendingUp className="w-4 h-4" />
              </Link>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(link.shortUrl, link.shortCode)}
                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                title="Copy short URL"
              >
                {copiedCode === link.shortCode ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(link.shortCode, link.url)}
                disabled={deletingCode === link.shortCode}
                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete link"
              >
                {deletingCode === link.shortCode ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
