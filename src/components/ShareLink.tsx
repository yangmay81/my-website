"use client";

import { useState } from "react";

export default function ShareLink({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/share/${token}`;

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
      <input
        type="text"
        value={url}
        readOnly
        className="flex-1 px-3 py-2 bg-white border border-border rounded-md text-sm"
        onFocus={(e) => e.target.select()}
      />
      <button
        onClick={handleCopy}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm flex-shrink-0 cursor-pointer"
      >
        {copied ? "已复制" : "复制链接"}
      </button>
    </div>
  );
}
