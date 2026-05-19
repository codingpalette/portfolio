"use client";

import { useEffect, useState } from "react";

const TECHS = ["React", "Python"];
const INTERVAL = 2400;

export function RotatingTech() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TECHS.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="relative inline-block h-[1.2em] overflow-hidden align-baseline"
      style={{ minWidth: "5ch" }}
      aria-live="polite"
    >
      {TECHS.map((tech, i) => (
        <span
          key={tech}
          className="absolute left-0 top-0 inline-block font-semibold text-[var(--accent)] transition-all duration-500 ease-out motion-reduce:transition-none"
          style={{
            transform: `translateY(${(i - index) * 100}%)`,
            opacity: i === index ? 1 : 0,
          }}
          aria-hidden={i !== index}
        >
          {tech}
        </span>
      ))}
    </span>
  );
}
