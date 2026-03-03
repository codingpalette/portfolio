import { createClient } from "@shared/api/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: publishedCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: blogCount } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true });

  const { count: publishedBlogCount } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  const stats = [
    { label: "전체 프로젝트", value: projectCount ?? 0 },
    { label: "공개 프로젝트", value: publishedCount ?? 0 },
    { label: "전체 포스트", value: blogCount ?? 0 },
    { label: "공개 포스트", value: publishedBlogCount ?? 0 },
    { label: "가입 유저", value: userCount ?? 0 },
  ];

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-white">대시보드</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
