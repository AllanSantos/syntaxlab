"use client";

import { useState, useCallback } from "react";
import { tokenize } from "@/lib/utils";

export type Step = "input" | "select" | "animate";

export interface PhraseSwapState {
  step: Step;
  phrase1: string; // Frase Original
  phrase2: string; // Frase Final
  words1: string[];
  words2: string[];
  explodeIndex: number | null;  // A que some (ex: took)
  originIndex: number | null;   // A que voa (ex: picking)
  resultIndex: number | null;   // O que se torna (ex: picked)
  animationKey: number;
}

const initial: PhraseSwapState = {
  step: "input",
  phrase1: "",
  phrase2: "",
  words1: [],
  words2: [],
  explodeIndex: null,
  originIndex: null,
  resultIndex: null,
  animationKey: 0,
};

export function usePhraseSwap() {
  const [state, setState] = useState<PhraseSwapState>(initial);

  const setPhrases = useCallback((phrase1: string, phrase2: string) => {
    setState((s) => ({ ...s, phrase1, phrase2 }));
  }, []);

  const swapPhrases = useCallback(() => {
    setState((s) => ({ ...s, phrase1: s.phrase2, phrase2: s.phrase1 }));
  }, []);

  const goToSelect = useCallback(() => {
    setState((s) => ({
      ...s,
      step: "select",
      words1: tokenize(s.phrase1),
      words2: tokenize(s.phrase2),
      explodeIndex: null,
      originIndex: null,
      resultIndex: null,
    }));
  }, []);

  const selectExplode = (i: number) => setState(s => ({ ...s, explodeIndex: i }));
  const selectOrigin = (i: number) => setState(s => ({ ...s, originIndex: i }));
  const selectResult = (i: number) => setState(s => ({ ...s, resultIndex: i }));

  const goToAnimate = useCallback(() => {
    setState((s) => ({ ...s, step: "animate", animationKey: s.animationKey + 1 }));
  }, []);

  const replay = useCallback(() => {
    setState((s) => ({ ...s, animationKey: s.animationKey + 1 }));
  }, []);

  const goBack = (to: Step) => setState((s) => ({ ...s, step: to }));
  const reset = () => setState(initial);

  return {
    state,
    setPhrases,
    swapPhrases,
    goToSelect,
    selectExplode,
    selectOrigin,
    selectResult,
    goToAnimate,
    replay,
    goBack,
    reset,
  };
}