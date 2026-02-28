"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@entities/project";
import { createClient } from "@shared/api/supabase/client";

const PRESET_CATEGORIES = [
  "Frontend",
  "Backend",
  "Full-Stack",
  "Mobile",
  "AI",
  "DevOps",
];

interface ProjectFormProps {
  project?: Project;
}

function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex min-h-[42px] flex-wrap gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition-all focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs text-cyan-300"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="ml-0.5 text-cyan-400 hover:text-white"
          >
            &times;
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(input)}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="min-w-[120px] flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
      />
    </div>
  );
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project;

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [category, setCategory] = useState(project?.category ?? "");
  const [customCategory, setCustomCategory] = useState("");
  const [techs, setTechs] = useState<string[]>(project?.techs ?? []);
  const [link, setLink] = useState(project?.link ?? "");
  const [github, setGithub] = useState(project?.github ?? "");
  const [sortOrder, setSortOrder] = useState(project?.sort_order ?? 0);
  const [isPublished, setIsPublished] = useState(
    project?.is_published ?? false,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allCategories = Array.from(
    new Set([...PRESET_CATEGORIES, ...(category && !PRESET_CATEGORIES.includes(category) ? [category] : [])]),
  );

  const handleAddCustomCategory = () => {
    const trimmed = customCategory.trim();
    if (trimmed) {
      setCategory(trimmed);
      setCustomCategory("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const data = {
      title,
      description,
      category,
      techs,
      link: link || null,
      github: github || null,
      sort_order: sortOrder,
      is_published: isPublished,
    };

    const result = isEditing
      ? await supabase.from("projects").update(data).eq("id", project.id)
      : await supabase.from("projects").insert(data);

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  };

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-white">
        {isEditing ? "프로젝트 수정" : "새 프로젝트"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-5 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
      >
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            설명
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>

        {/* 카테고리 태그 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            카테고리
          </label>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-3 py-1 text-sm transition-all ${
                  category === cat
                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-300"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomCategory();
                }
              }}
              placeholder="직접 입력..."
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
            />
            <button
              type="button"
              onClick={handleAddCustomCategory}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              추가
            </button>
          </div>
        </div>

        {/* 기술 스택 태그 입력 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            기술 스택
          </label>
          <TagInput
            tags={techs}
            onChange={setTechs}
            placeholder="입력 후 Enter로 추가"
          />
          <p className="text-xs text-gray-500">
            Enter 또는 쉼표(,)로 태그 추가, Backspace로 삭제
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="link"
              className="block text-sm font-medium text-gray-300"
            >
              Live Demo URL
            </label>
            <input
              id="link"
              type="url"
              placeholder="https://"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="github"
              className="block text-sm font-medium text-gray-300"
            >
              GitHub URL
            </label>
            <input
              id="github"
              type="url"
              placeholder="https://github.com/..."
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="sortOrder"
              className="block text-sm font-medium text-gray-300"
            >
              정렬 순서
            </label>
            <input
              id="sortOrder"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
            />
            <p className="text-xs text-gray-500">낮을수록 먼저 표시</p>
          </div>

          <div className="flex items-end space-y-2 pb-1">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500/50"
              />
              <span className="text-sm text-gray-300">공개</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:from-cyan-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "저장 중..." : isEditing ? "수정" : "등록"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
