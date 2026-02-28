import SnakeLoader from "@views/games/snake/SnakeLoader";

export const metadata = {
  title: "뱀 게임 | 이성재.dev",
  description: "클래식 뱀 게임 - 먹이를 먹고 최대한 길게 자라세요!",
};

export default function SnakePage() {
  return <SnakeLoader />;
}
