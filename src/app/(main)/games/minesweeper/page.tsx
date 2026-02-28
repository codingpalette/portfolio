import MinesweeperLoader from "@views/games/minesweeper/MinesweeperLoader";

export const metadata = {
  title: "지뢰찾기 | 이성재.dev",
  description: "지뢰를 피해 모든 칸을 열어보세요!",
};

export default function MinesweeperPage() {
  return <MinesweeperLoader />;
}
