"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@features/auth";
import { createClient } from "@shared/api/supabase/client";

export default function ProfileForm() {
  const { user, initialize } = useAuthStore();
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.profile.name);
      setAvatarUrl(user.profile.avatar_url);
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "이미지 파일만 업로드 가능합니다" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "파일 크기는 2MB 이하여야 합니다" });
      return;
    }

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    let newAvatarUrl = avatarUrl;

    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const filePath = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        setMessage({ type: "error", text: "이미지 업로드에 실패했습니다" });
        setSaving(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      newAvatarUrl = publicUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ name, avatar_url: newAvatarUrl })
      .eq("id", user.id);

    if (error) {
      setMessage({ type: "error", text: "프로필 수정에 실패했습니다" });
      setSaving(false);
      return;
    }

    setAvatarFile(null);
    setPreview(null);
    await initialize();
    setMessage({ type: "success", text: "프로필이 수정되었습니다" });
    setSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "새 비밀번호는 6자 이상이어야 합니다",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "새 비밀번호가 일치하지 않습니다",
      });
      return;
    }

    setChangingPassword(true);
    setPasswordMessage(null);

    const supabase = createClient();

    // 현재 비밀번호로 재인증
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      setPasswordMessage({
        type: "error",
        text: "현재 비밀번호가 올바르지 않습니다",
      });
      setChangingPassword(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordMessage({
        type: "error",
        text: "비밀번호 변경에 실패했습니다",
      });
      setChangingPassword(false);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage({
      type: "success",
      text: "비밀번호가 변경되었습니다",
    });
    setChangingPassword(false);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  const displayImage = preview ?? avatarUrl;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-card to-background px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block text-2xl font-bold text-foreground"
          >
            이성재
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              .dev
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-muted/50 p-8 backdrop-blur-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground">프로필 수정</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              프로필 정보를 변경하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {message && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${
                  message.type === "success"
                    ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300"
                    : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* 프로필 이미지 */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative h-24 w-24 overflow-hidden rounded-full border-2 border-border transition-all hover:border-cyan-500/50"
              >
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt="프로필 이미지"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-2xl font-bold text-muted-foreground">
                    {name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <svg
                    className="h-6 w-6 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                클릭하여 이미지 변경 (최대 2MB)
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-foreground"
              >
                아이디
              </label>
              <input
                id="userId"
                type="text"
                value={user.email.replace("@portfolio.local", "")}
                disabled
                className="w-full rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground outline-none"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                이름
              </label>
              <input
                id="name"
                type="text"
                placeholder="표시할 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                권한
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    user.profile.role === "admin"
                      ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {user.profile.role === "admin" ? "Admin" : "User"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-cyan-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </form>

          <hr className="my-6 border-border" />

          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div className="text-center">
              <h2 className="text-lg font-bold text-foreground">
                비밀번호 변경
              </h2>
            </div>

            {passwordMessage && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${
                  passwordMessage.type === "success"
                    ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300"
                    : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300"
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-foreground"
              >
                현재 비밀번호
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-foreground"
              >
                새 비밀번호
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="6자 이상"
                required
                className="w-full rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground"
              >
                새 비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호 재입력"
                required
                className="w-full rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-cyan-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {changingPassword ? "변경 중..." : "비밀번호 변경"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
