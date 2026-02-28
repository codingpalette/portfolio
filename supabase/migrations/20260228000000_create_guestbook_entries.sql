-- 방명록 테이블 생성
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스: 최신순 조회 최적화
CREATE INDEX IF NOT EXISTS idx_guestbook_entries_created_at
  ON guestbook_entries (created_at DESC);

-- RLS 활성화
ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;

-- SELECT: 누구나 읽기 가능
CREATE POLICY "guestbook_select_all"
  ON guestbook_entries FOR SELECT
  USING (true);

-- INSERT: 인증된 유저만 작성 가능 (자기 user_id만)
CREATE POLICY "guestbook_insert_authenticated"
  ON guestbook_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- DELETE: 관리자만 삭제 가능
CREATE POLICY "guestbook_delete_admin"
  ON guestbook_entries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );
