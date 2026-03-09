import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 - CleanPick",
  description: "CleanPick(푸드렌즈) 앱 개인정보처리방침",
};

export default function FoodLensPrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold">개인정보처리방침</h1>
      <p className="mb-6 text-muted-foreground">
        <strong>CleanPick (푸드렌즈)</strong> 앱(이하 &quot;앱&quot;)은
        이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을
        준수합니다. 본 개인정보처리방침은 앱이 수집하는 개인정보의 항목, 목적,
        보유 기간 및 이용자의 권리에 대해 안내합니다.
      </p>
      <p className="mb-10 text-sm text-muted-foreground">
        시행일: 2026년 3월 9일
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">
          1. 수집하는 개인정보 항목 및 수집 방법
        </h2>
        <h3 className="mb-2 mt-4 font-medium">회원가입 시</h3>
        <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
          <li>이메일 주소</li>
          <li>비밀번호 (암호화 저장)</li>
        </ul>
        <h3 className="mb-2 mt-4 font-medium">서비스 이용 시 (로그인 사용자)</h3>
        <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
          <li>식품 라벨 촬영 이미지</li>
          <li>AI 분석 결과 (원재료명, 건강 점수, 영양 정보)</li>
          <li>분석 이력 (분석 일시, 분석 모드)</li>
          <li>기기 식별자 (앱 내부 생성)</li>
        </ul>
        <h3 className="mb-2 mt-4 font-medium">비로그인 사용자</h3>
        <p className="text-muted-foreground">
          비로그인 상태에서는 개인정보를 서버에 저장하지 않습니다. 분석은
          일시적으로 처리되며, 앱 종료 시 삭제됩니다.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">
          2. 개인정보의 수집 및 이용 목적
        </h2>
        <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
          <li>식품 원재료 AI 분석 서비스 제공</li>
          <li>분석 이력 저장 및 조회 기능 제공</li>
          <li>회원 식별 및 계정 관리</li>
          <li>서비스 개선 및 오류 대응</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">
          3. 개인정보의 보유 및 파기
        </h2>
        <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
          <li>
            회원 탈퇴 시 해당 이용자의 개인정보(이메일, 분석 이력, 이미지)를
            지체 없이 파기합니다.
          </li>
          <li>
            관련 법령에 의해 보존이 필요한 경우, 해당 기간 동안만 보관 후
            파기합니다.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">
          4. 개인정보의 제3자 제공
        </h2>
        <p className="text-muted-foreground">
          앱은 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의
          경우에 한해 예외로 합니다.
        </p>
        <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
          <li>이용자가 사전에 동의한 경우</li>
          <li>법령에 의한 요청이 있는 경우</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">
          5. 개인정보 처리 위탁
        </h2>
        <p className="mb-3 text-muted-foreground">
          앱은 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁하고
          있습니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-medium">수탁업체</th>
                <th className="px-4 py-2 text-left font-medium">위탁 업무</th>
                <th className="px-4 py-2 text-left font-medium">처리 데이터</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="px-4 py-2">Supabase Inc.</td>
                <td className="px-4 py-2">
                  회원 인증, 데이터베이스 저장, 이미지 저장
                </td>
                <td className="px-4 py-2">
                  이메일, 비밀번호(암호화), 분석 이력, 이미지
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">OpenAI, Inc.</td>
                <td className="px-4 py-2">식품 라벨 이미지 AI 분석</td>
                <td className="px-4 py-2">식품 라벨 이미지 (일시적 전송)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">
          6. 이용자의 권리 및 행사 방법
        </h2>
        <p className="text-muted-foreground">
          이용자는 언제든지 다음의 권리를 행사할 수 있습니다.
        </p>
        <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
          <li>개인정보 열람 요청</li>
          <li>개인정보 수정 요청</li>
          <li>개인정보 삭제 요청 (회원 탈퇴)</li>
          <li>개인정보 처리 정지 요청</li>
        </ul>
        <p className="mt-3 text-muted-foreground">
          위 요청은 아래 연락처를 통해 접수하실 수 있으며, 지체 없이
          처리하겠습니다.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">
          7. 카메라 및 갤러리 접근 권한
        </h2>
        <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
          <li>
            <strong>카메라:</strong> 식품 원재료명을 촬영하여 AI 분석을 수행하기
            위해 사용됩니다.
          </li>
          <li>
            <strong>갤러리:</strong> 기존에 촬영한 식품 라벨 사진을 불러오기 위해
            사용됩니다.
          </li>
        </ul>
        <p className="mt-3 text-muted-foreground">
          해당 권한은 식품 분석 기능에만 사용되며, 이용자의 동의 없이 다른
          목적으로 사용하지 않습니다.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">
          8. 개인정보의 안전성 확보 조치
        </h2>
        <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
          <li>비밀번호 암호화 저장</li>
          <li>HTTPS를 통한 데이터 전송 암호화</li>
          <li>Row-Level Security(RLS)를 통한 데이터 접근 제어</li>
          <li>이용자별 격리된 이미지 저장소 운영</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">
          9. 개인정보처리방침 변경
        </h2>
        <p className="text-muted-foreground">
          본 개인정보처리방침은 관련 법령 및 서비스 변경에 따라 수정될 수
          있습니다. 변경 시 앱 내 공지 또는 본 페이지를 통해 안내합니다.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">
          10. 개인정보 보호책임자 및 연락처
        </h2>
        <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
          <li>
            <strong>책임자:</strong> 이성재
          </li>
          <li>
            <strong>이메일:</strong> openspace202@gmail.com
          </li>
        </ul>
      </section>

      <footer className="border-t pt-6 text-sm text-muted-foreground">
        <p>본 방침은 2026년 3월 9일부터 시행됩니다.</p>
      </footer>
    </main>
  );
}
