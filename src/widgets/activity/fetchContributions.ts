export interface Contribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionsResponse {
  total: Record<string, number>;
  contributions: Contribution[];
}

export async function fetchContributions(
  username: string,
): Promise<ContributionsResponse | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as ContributionsResponse;
    const sorted = [...data.contributions].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    return { total: data.total, contributions: sorted };
  } catch {
    return null;
  }
}
