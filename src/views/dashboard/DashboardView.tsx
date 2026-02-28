"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@features/auth";

const quickLinks = [
  {
    label: "프로필 수정",
    href: "/profile",
    description: "이름, 프로필 이미지 변경",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    label: "방명록",
    href: "/guestbook",
    description: "방명록 작성 및 조회",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    label: "미니게임",
    href: "/games",
    description: "미니게임 플레이",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.491 48.491 0 01-4.163-.3c-1.584-.233-2.707-1.626-2.707-3.228V6.741c0-1.602 1.123-2.995 2.707-3.228A48.394 48.394 0 0112 3c2.392 0 4.744.175 7.043.513 1.584.233 2.707 1.626 2.707 3.228V6.741c0 1.602-1.123 2.995-2.707 3.228a48.491 48.491 0 01-4.163.3.64.64 0 01-.657-.643v0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

type TabKey = "links" | "stats" | "leaderboard";

const TABS: { key: TabKey; label: string }[] = [
  { key: "links", label: "바로가기" },
  { key: "stats", label: "게임 통계" },
  { key: "leaderboard", label: "리더보드" },
];

interface DashboardViewProps {
  gameStatsSlot?: ReactNode;
  leaderboardSlot?: ReactNode;
}

export default function DashboardView({
  gameStatsSlot,
  leaderboardSlot,
}: DashboardViewProps) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabKey>("links");

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4 pt-28 pb-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-3xl">
        {/* 유저 인사 */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-cyan-500/30">
            {user.profile.avatar_url ? (
              <Image
                src={user.profile.avatar_url}
                alt="프로필"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-800 text-xl font-bold text-cyan-400/60">
                {user.profile.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              안녕하세요, {user.profile.name || "사용자"}님
            </h1>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* 계정 정보 */}
        <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">계정 정보</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500">이름</p>
              <p className="text-sm text-gray-300">{user.profile.name || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">권한</p>
              <span
                className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                  user.profile.role === "admin"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-gray-700/50 text-gray-400"
                }`}
              >
                {user.profile.role === "admin" ? "Admin" : "User"}
              </span>
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="mb-6 flex gap-2 border-b border-white/10 pb-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === "links" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 transition-colors group-hover:bg-cyan-500/20">
                  {link.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{link.label}</p>
                  <p className="text-xs text-gray-500">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "stats" && (
          gameStatsSlot ?? (
            <p className="text-sm text-gray-500">로그인 후 게임을 플레이하면 통계가 표시됩니다.</p>
          )
        )}

        {activeTab === "leaderboard" && (
          leaderboardSlot ?? (
            <p className="text-sm text-gray-500">아직 기록이 없습니다.</p>
          )
        )}
      </div>
    </div>
  );
}
