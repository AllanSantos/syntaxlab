"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// 1. Aqui definimos os tipos exatos de cada propriedade que o componente recebe!
interface AnimationStageProps {
  words1: string[];
  words2: string[];
  explodeIndex: number;
  originIndex: number;
  resultIndex: number;
  animationKey: number;
  onReplay: () => void;
  onBack: () => void;
  onReset: () => void;
}

const layoutTransition: Transition = { type: "spring", stiffness: 40, damping: 15, mass: 1 };

// 2. Trocamos o `: any` pelo tipo `: AnimationStageProps`
export function AnimationStage({
  words1,
  words2,
  explodeIndex,
  originIndex,
  resultIndex,
  animationKey,
  onReplay,
  onBack,
  onReset
}: AnimationStageProps) {
  const [step, setStep] = useState<"idle" | "ready" | "swap" | "done">("idle");

  useEffect(() => {
    setStep("idle");
    const t1 = setTimeout(() => setStep("ready"), 600);
    const t2 = setTimeout(() => setStep("swap"), 1400);
    const t3 = setTimeout(() => setStep("done"), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [animationKey]);

  const baseFont = "font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-black leading-tight";
  const isPhase1 = step === "idle" || step === "ready";

  const getSafeKey = (word: string, i: number) => `${word.toLowerCase()}-${i}`;

  return (
    <div className="flex flex-col gap-10">
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-3xl p-12 min-h-[300px] flex items-center justify-center">
        <motion.div layout className="flex flex-wrap gap-x-6 gap-y-6 items-baseline justify-center w-full">
          <AnimatePresence mode="popLayout">
            {(isPhase1 ? words1 : words2).map((word: string, i: number) => {
              const isExploding = isPhase1 && i === explodeIndex;
              const isOrigin = isPhase1 && i === originIndex;
              const isResult = !isPhase1 && i === resultIndex;

              if (isExploding) {
                return (
                  <motion.span key="exploding" layout transition={layoutTransition} className="relative inline-flex">
                    {/* Como avisamos que word é string, o split("") entende que 'c' é string também */}
                    {word.split("").map((c: string, j: number) => (
                      <motion.span key={j} className={cn(baseFont, "text-red-500/40")}
                        exit={{ opacity: 0, x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200, rotate: (Math.random() - 0.5) * 100, scale: 2, filter: "blur(10px)" }}
                        transition={{ duration: 1.5 }}
                      >{c}</motion.span>
                    ))}
                  </motion.span>
                );
              }

              if (isOrigin || isResult) {
                return (
                  <motion.span key="transform" layout layoutId="flying-word" transition={layoutTransition} className={cn(baseFont, "text-amber-400 z-50")}>
                    <AnimatePresence mode="wait">
                      <motion.span key={word} initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(4px)" }}>
                        {word}
                      </motion.span>
                    </AnimatePresence>
                  </motion.span>
                );
              }

              return (
                <motion.span key={getSafeKey(word, i)} layout transition={layoutTransition}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn(baseFont, "text-white/80")}>
                  {word}
                </motion.span>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {step === "done" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <p className="text-stone-300 text-xl md:text-2xl leading-relaxed">
              A palavra <span className="text-amber-400 font-black">{words1[originIndex]}</span> flutuou,
              substituiu <span className="text-red-400 font-black line-through">{words1[explodeIndex]}</span> e
              transformou-se em <span className="text-amber-400 font-black underline">{words2[resultIndex]}</span>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        <Button onClick={onReplay}>▶ Repetir Animação</Button>
        <Button variant="ghost" onClick={onBack}>← Editar Palavras</Button>
        <Button variant="ghost" onClick={onReset}>Recomeçar tudo</Button>
      </div>
    </div>
  );
}