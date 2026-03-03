"use client";

import Link from "next/link";

interface GameItem {
  title: string;
  description: string;
  href: string;
  emoji: string;
  color: string;
  ready: boolean;
}

const games: GameItem[] = [
  {
    title: "복셀 레이서",
    description: "3D 엔드리스 레이싱 게임",
    href: "/games/racing",
    emoji: "🏎️",
    color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/30",
    ready: true,
  },
  {
    title: "테트리스",
    description: "클래식 블록 쌓기 게임",
    href: "/games/tetris",
    emoji: "🧱",
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
    ready: true,
  },
  {
    title: "2048",
    description: "숫자 타일 합치기 퍼즐",
    href: "/games/2048",
    emoji: "🔢",
    color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
    ready: true,
  },
  {
    title: "뱀 게임",
    description: "클래식 스네이크 게임",
    href: "/games/snake",
    emoji: "🐍",
    color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    ready: true,
  },
  {
    title: "지뢰찾기",
    description: "클래식 지뢰찾기 퍼즐",
    href: "/games/minesweeper",
    emoji: "💣",
    color: "from-red-500/20 to-pink-500/20 border-red-500/30",
    ready: true,
  },
];

export default function GamesHub() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
            Mini Games
          </p>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">Games</h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            간단한 브라우저 게임들을 즐겨보세요
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          {games.map((game) => (
            <div key={game.title} className="relative">
              {game.ready ? (
                <Link
                  href={game.href}
                  className={`group block rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-border ${game.color}`}
                >
                  <GameCardContent game={game} />
                </Link>
              ) : (
                <div
                  className={`block rounded-2xl border bg-gradient-to-br p-6 opacity-50 backdrop-blur-sm ${game.color}`}
                >
                  <GameCardContent game={game} />
                  <span className="absolute top-4 right-4 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GameCardContent({ game }: { game: GameItem }) {
  return (
    <>
      <div className="mb-4 text-4xl">{game.emoji}</div>
      <h2 className="mb-2 text-xl font-bold text-foreground">{game.title}</h2>
      <p className="text-sm text-muted-foreground">{game.description}</p>
    </>
  );
}
