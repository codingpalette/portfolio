"use client";

import { useEffect, useState } from "react";

const TECHS = [
  "React",
  "Python",
  "Next.js",
  "FastAPI",
  "PHP",
  "Flutter",
  "React Native",
  "Ruby on Rails",
];
const INTERVAL = 2400;

const LONGEST = TECHS.reduce((a, b) => (b.length > a.length ? b : a));

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
      aria-live="polite"
    >
      <span
        className="invisible inline-block whitespace-nowrap font-semibold"
        aria-hidden="true"
      >
        {LONGEST}
      </span>
      {TECHS.map((tech, i) => (
        <span
          key={tech}
          className="absolute left-0 top-0 inline-block whitespace-nowrap font-semibold text-[var(--accent)] transition-all duration-500 ease-out motion-reduce:transition-none"
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
