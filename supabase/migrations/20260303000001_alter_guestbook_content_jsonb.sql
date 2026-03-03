-- 방명록 content JSONB 컬럼 추가
ALTER TABLE guestbook_entries ADD COLUMN IF NOT EXISTS content JSONB;

-- 기존 message TEXT → Slate JSON 형태로 데이터 변환
UPDATE guestbook_entries
SET content = jsonb_build_array(
  jsonb_build_object(
    'type', 'p',
    'children', jsonb_build_array(
      jsonb_build_object('text', COALESCE(message, ''))
    )
  )
)
WHERE content IS NULL;

-- content NOT NULL 제약 추가
ALTER TABLE guestbook_entries ALTER COLUMN content SET NOT NULL;
ALTER TABLE guestbook_entries ALTER COLUMN content SET DEFAULT '[{"type":"p","children":[{"text":""}]}]'::jsonb;

-- 기존 message 컬럼 삭제
ALTER TABLE guestbook_entries DROP COLUMN IF EXISTS message;
