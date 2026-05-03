"use client";

import { useState, useCallback } from "react";
import { tokenize } from "@/lib/utils";

export type Step = "input" | "select" | "animate";

export interface PhraseSwapState {
  step: Step;
  phrase1: string;
  phrase2: string;
  words1: string[];
  words2: string[];
  sourceIndex: number | null;
  targetIndex: number | null;
  isAnimating: boolean;
  animationKey: number;
}

const initial: PhraseSwapState = {
  step: "input",
  phrase1: "",
  phrase2: "",
  words1: [],
  words2: [],
  sourceIndex: null,
  targetIndex: null,
  isAnimating: false,
  animationKey: 0,
};

export function usePhraseSwap() {
  const [state, setState] = useState<PhraseSwapState>(initial);

  const setPhrases = useCallback((phrase1: string, phrase2: string) => {
    setState((s) => ({ ...s, phrase1, phrase2 }));
  }, []);

  const goToSelect = useCallback(() => {
    setState((s) => ({
      ...s,
      step: "select",
      words1: tokenize(s.phrase1),
      words2: tokenize(s.phrase2),
      sourceIndex: null,
      targetIndex: null,
    }));
  }, []);

  const selectSource = useCallback((index: number) => {
    setState((s) => ({ ...s, sourceIndex: index }));
  }, []);

  const selectTarget = useCallback((index: number) => {
    setState((s) => ({ ...s, targetIndex: index }));
  }, []);

  const goToAnimate = useCallback(() => {
    setState((s) => ({
      ...s,
      step: "animate",
      isAnimating: false,
      animationKey: s.animationKey + 1,
    }));
  }, []);

  const replay = useCallback(() => {
    setState((s) => ({
      ...s,
      isAnimating: false,
      animationKey: s.animationKey + 1,
    }));
  }, []);

  const setAnimating = useCallback((v: boolean) => {
    setState((s) => ({ ...s, isAnimating: v }));
  }, []);

  const goBack = useCallback((to: Step) => {
    setState((s) => ({ ...s, step: to }));
  }, []);

  const reset = useCallback(() => setState(initial), []);

  return {
    state,
    setPhrases,
    goToSelect,
    selectSource,
    selectTarget,
    goToAnimate,
    replay,
    setAnimating,
    goBack,
    reset,
  };
}