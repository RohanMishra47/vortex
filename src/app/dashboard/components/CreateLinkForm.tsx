"use client";

import { Link as LinkIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateLinkFormProps {
  onLinkCreated: () => void;
}

export default function CreateLinkForm({ onLinkCreated }: CreateLinkFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create link");
      }

      // Success!
      toast.success("Link created successfully!", {
        description: `Short URL: ${data.shortUrl}`,
        action: {
          label: "Copy",
          onClick: () => {
            navigator.clipboard.writeText(data.shortUrl);
            toast.success("Copied to clipboard!");
          },
        },
      });

      setUrl("");
      onLinkCreated(); // Refresh the links list
    } catch (err) {
      toast.error("Failed to create link", {
        description:
          err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-linear-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-lg border border-purple-500/30 p-6">
      <div className="flex items-center gap-2 mb-4">
        <LinkIcon className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">Create Short Link</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Enter your long URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !url}
          className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4" />
              Shorten URL
            </>
          )}
        </button>
      </form>
    </div>
  );
}
