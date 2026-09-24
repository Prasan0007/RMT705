"use client";

import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/utils";

/** Renders a placeholder until mounted, then live relative time — keeps
 * server and first client paint identical regardless of clock skew. */
export function TimeAgo({ iso }: { iso: string }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe: placeholder on first paint, live value after mount
    setText(timeAgo(iso));
    const id = setInterval(() => setText(timeAgo(iso)), 30000);
    return () => clearInterval(id);
  }, [iso]);

  return <>{text ?? " "}</>;
}
