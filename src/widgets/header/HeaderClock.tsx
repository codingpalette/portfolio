"use client";

import { useEffect, useState } from "react";

function formatTime(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formatter.format(date);
}

export function HeaderClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(formatTime(new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <span
      className="hidden font-mono text-xs tabular-nums text-muted-foreground md:inline-flex"
      aria-label="현재 한국 시각"
    >
      {time} KST
    </span>
  );
}
