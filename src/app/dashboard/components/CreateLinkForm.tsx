"use client";

import axios, { AxiosError } from "axios";
import { Check, Copy, Link as LinkIcon, Loader2 } from "lucide-react";
import { useState } from "react";

interface CreateLinkFormProps {
  onLinkCreated: () => void;
}

export default function CreateLinkForm({ onLinkCreated }: CreateLinkFormProps) {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await axios.post("/api/links", { url });
      const data = response.data;

      if (!data.shortUrl) {
        throw new Error("No shortened URL returned");
      }

      setSuccess(true);
      setUrl("");
      onLinkCreated(); // Refresh the links list
      setShortenedUrl(data.shortUrl);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<{ error?: string }>;
        setError(serverError.response?.data?.error || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
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
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
            ✓ Link created successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !url}
          className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
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
        {shortenedUrl && (
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shortenedUrl}
              className="px-3 py-2 bg-gray-800 text-white rounded-md w-full"
            />
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(shortenedUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              title="Copy short URL"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
