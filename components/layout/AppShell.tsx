"use client";

import { useUiStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { StreamerOverlay } from "@/components/streamer/StreamerOverlay";

export function AppShell({ children }: { children: React.ReactNode }) {
  const chromaKey = useUiStore((s) => s.chromaKey);
  const streamerMode = useUiStore((s) => s.streamerMode);

  return (
    <div className={cn("bg-mesh min-h-screen", chromaKey && streamerMode && "chroma-bg")}>
      {children}
      <StreamerOverlay />
    </div>
  );
}
