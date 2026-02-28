"use client";

import { useRef, useCallback } from "react";
import { useAuthStore } from "@features/auth";
import { createClient } from "@shared/api/supabase/client";
import type { GameType } from "@entities/game-score";

export function useSubmitScore(game: GameType) {
  const submittedRef = useRef(false);

  const submitScore = useCallback(
    async (score: number, metadata: Record<string, unknown> = {}) => {
      if (submittedRef.current) return;

      const user = useAuthStore.getState().user;
      if (!user) return;

      submittedRef.current = true;

      try {
        const supabase = createClient();
        await supabase.from("game_scores").insert({
          user_id: user.id,
          player_name: user.profile.name || "익명",
          game,
          score,
          metadata,
        });
      } catch {
        // silent fail — 게임 플로우 방해 금지
      }
    },
    [game],
  );

  const resetSubmission = useCallback(() => {
    submittedRef.current = false;
  }, []);

  return { submitScore, resetSubmission };
}
