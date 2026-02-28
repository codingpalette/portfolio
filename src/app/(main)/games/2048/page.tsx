import Game2048Loader from "@views/games/2048/Game2048Loader";

export const metadata = {
  title: "2048 | 이성재.dev",
  description: "숫자 타일을 합쳐 2048을 만드세요!",
};

export default function Game2048Page() {
  return <Game2048Loader />;
}
