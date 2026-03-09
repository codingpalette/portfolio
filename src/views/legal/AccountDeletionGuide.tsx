import Link from "next/link";

import { Button } from "@shared/ui/button";

export function AccountDeletionGuide() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold">푸드렌즈 계정 삭제 안내</h1>
      <p className="mb-6 text-muted-foreground">
        푸드렌즈는 앱 안에서 직접 회원탈퇴를 진행할 수 있으며, 앱 사용이 어려운 경우
        아래 이메일을 통해 계정 및 관련 데이터 삭제를 요청할 수 있습니다.
      </p>
      <p className="mb-10 text-sm text-muted-foreground">시행일: 2026년 3월 9일</p>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">1. 앱에서 직접 회원탈퇴하는 방법</h2>
        <ol className="ml-6 list-decimal space-y-2 text-muted-foreground">
          <li>푸드렌즈 앱에 로그인합니다.</li>
          <li>`내 정보` 탭으로 이동합니다.</li>
          <li>`회원탈퇴` 버튼을 누르고 확인합니다.</li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">2. 회원탈퇴 시 삭제되는 정보</h2>
        <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
          <li>계정 정보: 이메일 주소와 인증 계정</li>
          <li>분석 기록: 저장된 분석 결과와 이력</li>
          <li>업로드 이미지: 분석을 위해 저장된 이미지 파일</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">3. 앱 접근이 어려운 경우</h2>
        <p className="mb-4 text-muted-foreground">
          앱에 로그인할 수 없거나 앱 내 탈퇴가 어려운 경우 아래 이메일로 탈퇴 요청을
          보내주세요. 요청 시 계정 확인을 위해 푸드렌즈에 가입한 이메일 주소를 함께
          적어주셔야 합니다.
        </p>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">삭제 요청 이메일</p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            openspace202@gmail.com
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild>
              <a
                href="mailto:openspace202@gmail.com?subject=%ED%91%B8%EB%93%9C%EB%A0%8C%EC%A6%88%20%EA%B3%84%EC%A0%95%20%EC%82%AD%EC%A0%9C%20%EC%9A%94%EC%B2%AD&body=%EA%B0%80%EC%9E%85%20%EC%9D%B4%EB%A9%94%EC%9D%BC%3A%20%0A%EC%82%AD%EC%A0%9C%20%EC%9A%94%EC%B2%AD%20%EC%82%AC%EC%9C%A0%3A%20"
              >
                이메일로 요청하기
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/privacy/food-lens">개인정보처리방침 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">4. 처리 기간</h2>
        <p className="text-muted-foreground">
          본인 확인이 완료되면 지체 없이 삭제를 진행합니다. 관련 법령상 별도 보관이
          필요한 정보가 없다면 계정과 관련 데이터는 함께 삭제됩니다.
        </p>
      </section>

      <footer className="border-t pt-6 text-sm text-muted-foreground">
        <p>본 안내는 2026년 3월 9일부터 적용됩니다.</p>
      </footer>
    </main>
  );
}
