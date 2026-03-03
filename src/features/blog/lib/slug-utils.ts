/**
 * 제목 → URL 슬러그 변환
 * 한글은 유지, 특수문자 제거, 공백은 하이픈으로 변환
 */
export function generateSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
