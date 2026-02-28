-- 게임 점수 테이블 생성
CREATE TABLE IF NOT EXISTS game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  game TEXT NOT NULL CHECK (game IN ('2048', 'tetris', 'snake', 'racing', 'minesweeper')),
  score INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스: 게임별 리더보드 (높은 점수 순)
CREATE INDEX IF NOT EXISTS idx_game_scores_leaderboard
  ON game_scores (game, score DESC);

-- 인덱스: 유저별 기록 조회
CREATE INDEX IF NOT EXISTS idx_game_scores_user
  ON game_scores (user_id, game, created_at DESC);

-- 인덱스: 지뢰찾기 난이도별 리더보드 (낮은 점수 = 빠른 시간)
CREATE INDEX IF NOT EXISTS idx_game_scores_minesweeper_difficulty
  ON game_scores (game, (metadata->>'difficulty'), score ASC)
  WHERE game = 'minesweeper';

-- RLS 활성화
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- SELECT: 누구나 읽기 가능
CREATE POLICY "game_scores_select_all"
  ON game_scores FOR SELECT
  USING (true);

-- INSERT: 인증된 유저만 작성 가능 (자기 user_id만)
CREATE POLICY "game_scores_insert_authenticated"
  ON game_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- DELETE: 관리자만 삭제 가능
CREATE POLICY "game_scores_delete_admin"
  ON game_scores FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );
