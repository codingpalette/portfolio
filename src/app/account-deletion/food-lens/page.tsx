import type { Metadata } from "next";

import { AccountDeletionGuide } from "@views/legal";

export const metadata: Metadata = {
  title: "계정 삭제 안내 - 푸드렌즈",
  description: "푸드렌즈 계정 및 관련 데이터 삭제 방법 안내",
};

export default function FoodLensAccountDeletionPage() {
  return <AccountDeletionGuide />;
}
