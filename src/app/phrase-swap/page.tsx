"use client";

import { usePhraseSwap } from "@/hooks/usePhraseSwap";
import { PhraseEditor } from "@/components/phrase-swap/PhraseEditor";
import { WordSelector } from "@/components/phrase-swap/WordSelector";
import { AnimationStage } from "@/components/phrase-swap/AnimationStage";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PhraseSwapPage() {
  const {
    state, setPhrases, swapPhrases, goToSelect,
    selectExplode, selectOrigin, selectResult,
    goToAnimate, replay, goBack, reset
  } = usePhraseSwap();

  const { step, words1, words2, explodeIndex, originIndex, resultIndex, animationKey, phrase1, phrase2 } = state;

  function handleConfirmPhrases(p1: string, p2: string) {
    setPhrases(p1, p2);
    goToSelect();
  }

  return (
    <div className="min-h-screen bg-[#0f0e17] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/"
              className="text-xs tracking-[0.3em] uppercase text-amber-400/70 font-medium hover:text-amber-400 transition-colors"
            >
              SyntaxLab
            </Link>
            <span className="w-1 h-1 rounded-full bg-stone-600" />
            <span className="text-xs tracking-[0.2em] uppercase text-stone-600">
              Phrase Swap
            </span>
          </div>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Veja como as palavras <br />
            <span className="text-amber-400">se transformam.</span>
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed max-w-md">
            Escreva duas frases equivalentes e mostre, visualmente, como uma
            palavra pode mudar de forma sem mudar o sentido.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {(["input", "select", "animate"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors duration-300 ${step === s
                  ? "bg-amber-400 text-stone-950"
                  : i < ["input", "select", "animate"].indexOf(step)
                    ? "bg-amber-400/20 text-amber-400"
                    : "bg-white/5 text-stone-600"
                  }`}
              >
                {i + 1}
              </div>
              {i < 2 && <div className="w-8 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {step === "input" && (
              <PhraseEditor initialPhrase1={phrase1} initialPhrase2={phrase2} onConfirm={(p1, p2) => { setPhrases(p1, p2); goToSelect(); }} onSwap={swapPhrases} />
            )}

            {step === "select" && (
              <WordSelector
                words1={words1} words2={words2}
                explodeIndex={explodeIndex} originIndex={originIndex} resultIndex={resultIndex}
                onSelectExplode={selectExplode} onSelectOrigin={selectOrigin} onSelectResult={selectResult}
                onConfirm={goToAnimate} onBack={() => goBack("input")}
              />
            )}

            {step === "animate" &&
              explodeIndex !== null &&
              originIndex !== null &&
              resultIndex !== null && (
                <AnimationStage
                  words1={words1}
                  words2={words2}
                  explodeIndex={explodeIndex}
                  originIndex={originIndex}
                  resultIndex={resultIndex}
                  animationKey={animationKey}
                  onReplay={replay}
                  onBack={() => goBack("select")}
                  onReset={reset}
                />
              )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}