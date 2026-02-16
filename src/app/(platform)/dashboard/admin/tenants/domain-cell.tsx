"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

interface DomainCellProps {
  url: string;
}

export function DomainCell({ url }: DomainCellProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Fallback for older browsers or non-secure contexts
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback method
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleOpenNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative max-w-md">
      <input
        type="text"
        value={url}
        readOnly
        className="w-full h-9 px-3 pr-20 text-sm bg-muted border border-input rounded-md cursor-default focus:outline-none"
      />
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-background rounded px-0.5">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-accent hover:text-accent-foreground"
          onClick={handleCopy}
          title="Copy URL"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-accent hover:text-accent-foreground"
          onClick={handleOpenNewTab}
          title="Open in new tab"
        >
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
