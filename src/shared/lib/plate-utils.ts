type SlateNode = Record<string, unknown>;

/**
 * Slate JSON → 플레인 텍스트 추출 (SEO, 글자수 체크용)
 */
export function extractPlainText(content: SlateNode[]): string {
  return content
    .map((node) => {
      if (typeof node.text === "string") return node.text;
      if (Array.isArray(node.children))
        return extractPlainText(node.children as SlateNode[]);
      return "";
    })
    .join("");
}

/**
 * 빈 에디터 초기값 반환
 */
export function createEmptyContent(): SlateNode[] {
  return [{ type: "p", children: [{ text: "" }] }];
}
