"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface AnimationStageProps {
  words1: string[];
  words2: string[];
  sourceIndex: number;
  targetIndex: number;
  animationKey: number;
  onReplay: () => void;
  onBack: () => void;
  onReset: () => void;
}

// Phases:
// "idle"    → frase A completa, tudo parado
// "lift"    → storming fica destacado, prestes a mover
// "fly"     → storming voa em direção ao went
// "explode" → went explode enquanto storming chega
// "land"    → storming pousou, muda para stormed
// "done"    → frase final estável
type Phase = "idle" | "lift" | "fly" | "explode" | "land" | "done";

export function AnimationStage({
  words1,
  words2,
  sourceIndex,
  targetIndex,
  animationKey,
  onReplay,
  onBack,
  onReset,
}: AnimationStageProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [floatingText, setFloatingText] = useState(words1[sourceIndex]);
  const [floatPos, setFloatPos] = useState({ x: 0, y: 0 });
  const [floatDelta, setFloatDelta] = useState({ dx: 0, dy: 0 });

  // refs para medir posição das palavras no DOM
  const sourceWordRef = useRef<HTMLSpanElement>(null); // storming
  const targetWordRef = useRef<HTMLSpanElement>(null); // went

  useEffect(() => {
    setPhase("idle");
    setFloatingText(words1[sourceIndex]);

    // pequena pausa antes de começar
    const t1 = setTimeout(() => {
      setPhase("lift");

      const t2 = setTimeout(() => {
        // mede posições antes de voar
        if (sourceWordRef.current && targetWordRef.current) {
          const srcRect = sourceWordRef.current.getBoundingClientRect();
          const tgtRect = targetWordRef.current.getBoundingClientRect();
          setFloatPos({ x: srcRect.left, y: srcRect.top });
          setFloatDelta({
            dx: tgtRect.left - srcRect.left,
            dy: tgtRect.top - srcRect.top,
          });
        }
        setPhase("fly");

        // went explode enquanto storming está chegando
        const t3 = setTimeout(() => {
          setPhase("explode");

          // storming pousou, vira stormed
          const t4 = setTimeout(() => {
            setFloatingText(words2[targetIndex]);
            setPhase("land");

            const t5 = setTimeout(() => {
              setPhase("done");
            }, 600);

            return () => clearTimeout(t5);
          }, 400);

          return () => clearTimeout(t4);
        }, 700);

        return () => clearTimeout(t3);
      }, 600);

      return () => clearTimeout(t2);
    }, 500);

    return () => clearTimeout(t1);
  }, [animationKey]);

  const isFlying = phase === "fly" || phase === "explode" || phase === "land";
  const wentGone = phase === "explode" || phase === "land" || phase === "done";
  const stormingGone = isFlying || phase === "done"; // palavra original some quando clona voa
  const showFinalWord = phase === "done"; // palavra final aparece inline

  return (
    <div className="flex flex-col gap-10">
      <p className="text-xs tracking-[0.2em] uppercase text-stone-500">
        Animação
      </p>

      <div className="relative bg-white/[0.02] border border-white/[0.07] rounded-2xl p-10 min-h-[220px] flex items-center">
        {/* Frase principal — sempre a frase A como base, words1 */}
        <div className="flex flex-wrap gap-x-5 gap-y-3 items-baseline w-full">
          {words1.map((word, i) => {
            const isTarget = i === targetIndex; // went
            const isSource = i === sourceIndex; // storming

            // "went" — explode e some
            if (isTarget) {
              return (
                <AnimatePresence key={i} mode="popLayout">
                  {!wentGone && (
                    <motion.span
                      ref={targetWordRef}
                      className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-black text-red-400 leading-tight"
                      initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{
                        opacity: 0,
                        scale: 1.5,
                        filter: "blur(16px)",
                        transition: { duration: 0.45, ease: "easeOut" },
                      }}
                    >
                      {word}
                    </motion.span>
                  )}
                </AnimatePresence>
              );
            }

            // "storming" — fica visível até voar, depois some inline; no final reaparece como "stormed"
            if (isSource) {
              return (
                <span key={i} className="relative">
                  {/* Palavra original — some quando voa */}
                  <AnimatePresence mode="popLayout">
                    {!stormingGone && (
                      <motion.span
                        ref={sourceWordRef}
                        className={cn(
                          "font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-black leading-tight inline-block",
                          phase === "lift" ? "text-amber-400" : "text-amber-400/60"
                        )}
                        animate={
                          phase === "lift"
                            ? { scale: [1, 1.08, 1], transition: { duration: 0.5 } }
                            : {}
                        }
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      >
                        {word}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Palavra final "stormed" aparece inline no lugar */}
                  <AnimatePresence>
                    {showFinalWord && (
                      <motion.span
                        className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-black text-amber-400 leading-tight"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: "backOut" }}
                      >
                        {words2[targetIndex]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              );
            }

            // Palavras normais
            return (
              <span
                key={i}
                className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-black text-white/90 leading-tight"
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Clone voador — fixo na tela, anima de storming até went */}
        <AnimatePresence>
          {isFlying && (
            <motion.span
              key="flyer"
              className="fixed font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-black text-amber-400 pointer-events-none z-50 leading-tight"
              style={{ left: floatPos.x, top: floatPos.y }}
              initial={{ x: 0, y: 0, scale: 1 }}
              animate={{
                x: floatDelta.dx,
                y: floatDelta.dy,
                scale: [1, 1.2, 1],
              }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
              transition={{
                duration: 0.9,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {floatingText}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Legenda do resultado */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.p
            className="text-stone-500 text-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-amber-400 font-medium">{words1[sourceIndex]}</span>
            {" "}virou{" "}
            <span className="text-amber-400 font-medium">{words2[targetIndex]}</span>
            {" "}e ocupou o lugar de{" "}
            <span className="text-red-400 font-medium">{words1[targetIndex]}</span>.
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex gap-3 flex-wrap">
        <Button onClick={onReplay}>▶ Repetir</Button>
        <Button variant="ghost" onClick={onBack}>← Editar</Button>
        <Button variant="ghost" onClick={onReset}>Recomeçar</Button>
      </div>
    </div>
  );
}