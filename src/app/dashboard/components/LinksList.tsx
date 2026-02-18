"use client";

import { formatDistanceToNow } from "date-fns";
import { Check, Copy, ExternalLink, Trash2 } from "lucide-react";
import { useState } from "react";

interface Link {
  id: number;
  shortCode: string;
  shortUrl: string;
  url: string;
  clickCount: number;
  createdAt: string;
}

interface LinksListProps {
  links: Link[];
  onDelete: (shortCode: string) => void;
}

export default function LinksList({ links, onDelete }: LinksListProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const copyToClipboard = async (shortUrl: string, shortCode: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedCode(shortCode);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = async (shortCode: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this link? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeletingCode(shortCode);
    try {
      await onDelete(shortCode);
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeletingCode(null);
    }
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No links yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <div
          key={link.id}
          className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6 hover:bg-white/12 transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Link Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <code className="text-lg font-mono font-bold text-purple-400">
                  /{link.shortCode}
                </code>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                  {link.clickCount} {link.clickCount === 1 ? "click" : "clicks"}
                </span>
              </div>

              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-white flex items-center gap-2 group truncate"
              >
                <span className="truncate">{link.url}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
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
                onClick={() => handleDelete(link.shortCode)}
                disabled={deletingCode === link.shortCode}
                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-colors disabled:opacity-50"
                title="Delete link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
