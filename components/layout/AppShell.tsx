"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { StreamerOverlay } from "@/components/streamer/StreamerOverlay";

export function AppShell({ children }: { children: React.ReactNode }) {
  const chromaKey = useAppStore((s) => s.chromaKey);
  const streamerMode = useAppStore((s) => s.streamerMode);

  return (
    <div className={cn("bg-mesh min-h-screen", chromaKey && streamerMode && "chroma-bg")}>
      {children}
      <StreamerOverlay />
    </div>
  );
}
