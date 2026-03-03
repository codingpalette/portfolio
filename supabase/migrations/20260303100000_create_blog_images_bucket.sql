-- blog-images 스토리지 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- 공개 읽기
DROP POLICY IF EXISTS "blog_images_public_read" ON storage.objects;
CREATE POLICY "blog_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

-- admin만 업로드
DROP POLICY IF EXISTS "blog_images_admin_insert" ON storage.objects;
CREATE POLICY "blog_images_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'blog-images'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- admin만 삭제
DROP POLICY IF EXISTS "blog_images_admin_delete" ON storage.objects;
CREATE POLICY "blog_images_admin_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'blog-images'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
