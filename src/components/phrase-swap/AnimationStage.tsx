"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  onSave?: () => void;
  isSaving?: boolean;
  savedSuccess?: boolean;
  isReadOnly?: boolean;
}

export function AnimationStage({
  words1, words2, explodeIndex, originIndex, resultIndex, animationKey,
  onReplay, onBack, onReset, onSave, isSaving, savedSuccess, isReadOnly = false
}: AnimationStageProps) {

  // Fases da nossa Coreografia:
  // 0: Inicial (Lendo a frase)
  // 1: Explosão (A palavra a ser substituída some)
  // 2: Flutuação (A palavra de origem viaja até o espaço vazio)
  // 3: Mutação (A palavra transforma-se no resultado final)
  const [phase, setPhase] = useState(0);
  const [mutationDone, setMutationDone] = useState(false);

  const READ_DURATION_MS = 2500;
  const EXPLODE_DURATION_MS = 1800;
  const FLOAT_DURATION_MS = 7000;
  const MUTATION_DURATION_MS = 5000;

  useEffect(() => {
    setPhase(0);
    setMutationDone(false);

    const t1 = setTimeout(() => setPhase(1), READ_DURATION_MS);
    const t2 = setTimeout(() => setPhase(2), READ_DURATION_MS + EXPLODE_DURATION_MS);
    const t3 = setTimeout(() => setPhase(3), READ_DURATION_MS + EXPLODE_DURATION_MS + FLOAT_DURATION_MS);
    const t4 = setTimeout(
      () => setMutationDone(true),
      READ_DURATION_MS + EXPLODE_DURATION_MS + FLOAT_DURATION_MS + MUTATION_DURATION_MS
    );

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [animationKey]);

  // Esta função garante que o Framer Motion saiba exatamente quem é quem
  // na hora de cruzar os dados da Frase 1 para a Frase 2
  const words2LayoutIds = useMemo(() => {
    const mapping = [];
    let w1Idx = 0;
    for (let i = 0; i < words2.length; i++) {
      if (i === resultIndex) {
        mapping.push('moving-word'); // O ID fixo da palavra que viaja
        continue;
      }
      // Pula os índices que foram afetados na Frase 1
      while (w1Idx === explodeIndex || w1Idx === originIndex) {
        w1Idx++;
      }
      mapping.push(`word-${w1Idx}`);
      w1Idx++;
    }
    return mapping;
  }, [words1, words2, explodeIndex, originIndex, resultIndex]);

  // Montamos o Array de exibição dependendo da Fase em que estamos
  let currentWords = [];

  if (phase < 2) {
    // Fases 0 e 1: Mostramos a Frase 1 (Original)
    currentWords = words1.map((word, i) => ({
      id: i === originIndex ? 'moving-word' : `word-${i}`,
      text: word,
      isExploding: phase === 1 && i === explodeIndex,
      isMorphing: false,
      morphed: false,
    }));
  } else {
    // Fases 2 e 3: Mostramos a Frase 2 (Destino)
    currentWords = words2.map((word, i) => ({
      id: words2LayoutIds[i],
      text: i === resultIndex && phase === 2 ? words1[originIndex] : word, // Se estiver voando, ainda mostra o texto velho!
      isExploding: false,
      isMorphing: i === resultIndex,
      morphed: phase === 3 && i === resultIndex,
    }));
  }

  return (
    <div className="w-full flex flex-col items-center">

      {/* O PALCO DAS PALAVRAS */}
      <motion.div
        className="w-full max-w-3xl border border-white/5 bg-white/[0.02] rounded-3xl p-12 min-h-[280px] flex items-center justify-center shadow-2xl relative overflow-hidden"
        animate={phase === 1 ? { x: [0, -10, 12, -7, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          animate={{
            backgroundColor: phase === 1
              ? ["rgba(239,68,68,0)", "rgba(239,68,68,0.22)", "rgba(249,115,22,0.12)", "rgba(239,68,68,0)"]
              : "rgba(239,68,68,0)",
          }}
          transition={{ duration: EXPLODE_DURATION_MS / 1000, ease: "easeOut" }}
        />
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-6 items-center text-5xl font-['Playfair_Display'] font-bold relative z-10">
          {currentWords.map((item) => {
            const isExploding = item.isExploding;
            const isFlying = item.id === "moving-word" && phase === 2;
            const isMutating = item.id === "moving-word" && phase === 3 && !mutationDone;
            const isShocked = phase === 1 && !isExploding;

            return (
            <motion.span
              key={item.id}
              layoutId={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isExploding ? [1, 1, 0.7, 0] : 1,
                scale: isExploding
                  ? [1, 1.85, 1.5, 0]
                  : isFlying
                    ? 1.45
                    : isMutating
                      ? [1.45, 1.7, 1]
                      : isShocked
                        ? [1, 1.06, 0.97, 1]
                        : 1,
                rotate: isExploding
                  ? [0, -14, 22, 55]
                  : isFlying
                    ? [0, -16, 14, -8, 0]
                    : isMutating
                      ? [0, 4, -3, 0]
                      : isShocked
                        ? [0, -2, 2, 0]
                        : 0,
                x: isExploding ? [0, -6, 10, -20] : isShocked ? [0, -4, 4, -2, 0] : 0,
                y: isExploding
                  ? [0, -12, 8, -40]
                  : isFlying
                    ? [0, -55, -30, -65, 0]
                    : isShocked
                      ? [0, 3, -2, 0]
                      : 0,
                filter: isExploding
                  ? [
                      "blur(0px)",
                      "blur(0px) drop-shadow(0 0 25px rgba(239,68,68,1))",
                      "blur(6px) drop-shadow(0 0 50px rgba(249,115,22,1))",
                      "blur(24px)",
                    ]
                  : isFlying
                    ? "blur(0px) drop-shadow(0 0 30px rgba(251,191,36,1))"
                    : isMutating
                      ? [
                          "blur(0px) drop-shadow(0 0 20px rgba(251,191,36,0.6))",
                          "blur(5px) drop-shadow(0 0 40px rgba(59,130,246,0.9))",
                          "blur(0px)",
                        ]
                      : "blur(0px)",
                color: isExploding
                  ? ["#ffffff", "#ef4444", "#f97316", "#ef4444"]
                  : item.morphed
                    ? "#3b82f6"
                    : item.isMorphing
                      ? "#fbbf24"
                      : "#ffffff",
              }}
              transition={{
                layout: { duration: FLOAT_DURATION_MS / 1000, ease: [0.12, 1.45, 0.28, 1.05] },
                opacity: isExploding
                  ? { duration: EXPLODE_DURATION_MS / 1000, times: [0, 0.15, 0.55, 1], ease: "easeIn" }
                  : { duration: 0.5 },
                scale: isExploding
                  ? { duration: EXPLODE_DURATION_MS / 1000, times: [0, 0.12, 0.35, 1], ease: [0.36, 0, 0.66, -0.2] }
                  : isMutating
                    ? { duration: MUTATION_DURATION_MS / 1000, ease: "easeInOut" }
                    : isFlying
                      ? { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
                      : isShocked
                        ? { duration: 0.45, ease: "easeOut" }
                        : { duration: 0.5 },
                rotate: isExploding
                  ? { duration: EXPLODE_DURATION_MS / 1000, times: [0, 0.2, 0.5, 1], ease: "easeIn" }
                  : isFlying
                    ? { duration: FLOAT_DURATION_MS / 1000, ease: "easeInOut" }
                    : isMutating
                      ? { duration: MUTATION_DURATION_MS / 1000, ease: "easeInOut" }
                      : isShocked
                        ? { duration: 0.45, ease: "easeOut" }
                        : { duration: 0.3 },
                x: isExploding
                  ? { duration: EXPLODE_DURATION_MS / 1000, ease: "easeIn" }
                  : isShocked
                    ? { duration: 0.45, ease: "easeOut" }
                    : { duration: 0.3 },
                y: isExploding
                  ? { duration: EXPLODE_DURATION_MS / 1000, ease: "easeIn" }
                  : isFlying
                    ? { duration: FLOAT_DURATION_MS / 1000, ease: [0.22, 1.35, 0.42, 1] }
                    : isShocked
                      ? { duration: 0.45, ease: "easeOut" }
                      : { duration: 0.3 },
                filter: isExploding
                  ? { duration: EXPLODE_DURATION_MS / 1000, times: [0, 0.1, 0.4, 1], ease: "easeIn" }
                  : isMutating
                    ? { duration: MUTATION_DURATION_MS / 1000 }
                    : { duration: 0.6 },
                color: isExploding
                  ? { duration: EXPLODE_DURATION_MS / 1000, times: [0, 0.1, 0.35, 1] }
                  : isMutating
                    ? { duration: MUTATION_DURATION_MS / 1000 }
                    : { duration: 0.6 },
              }}
              style={{ zIndex: isExploding ? 60 : isFlying || isMutating ? 50 : undefined }}
              className="inline-block"
            >
              {item.text}
            </motion.span>
            );
          })}
        </div>
      </motion.div>

      {/* A CAIXA DE EXPLICAÇÃO DINÂMICA (Histórico em Timeline) */}
      <div className="mt-8 p-8 border border-white/10 rounded-2xl bg-white/[0.01] max-w-2xl w-full min-h-[240px] flex flex-col justify-center gap-5">
        <AnimatePresence>

          {phase >= 0 && (
            <motion.div key="0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: phase === 0 ? 1 : 0.4, x: 0 }} className="flex gap-4 items-center">
              <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${phase === 0 ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]' : 'bg-white/10 text-stone-500'}`}>1</span>
              <p className={phase === 0 ? "text-stone-300" : "text-stone-500"}>
                Lendo a estrutura original da frase...
              </p>
            </motion.div>
          )}

          {phase >= 1 && (
            <motion.div key="1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: phase === 1 ? 1 : 0.4, x: 0 }} className="flex gap-4 items-center">
              <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${phase === 1 ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]' : 'bg-white/10 text-stone-500'}`}>2</span>
              <p className={phase === 1 ? "text-stone-300" : "text-stone-500"}>
                A palavra <span className={`font-bold px-1 ${phase === 1 ? 'text-red-400 line-through' : ''}`}>{words1[explodeIndex]}</span> foi removida para liberar espaço.
              </p>
            </motion.div>
          )}

          {phase >= 2 && (
            <motion.div key="2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: phase === 2 ? 1 : 0.4, x: 0 }} className="flex gap-4 items-center">
              <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${phase === 2 ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]' : 'bg-white/10 text-stone-500'}`}>3</span>
              <p className={phase === 2 ? "text-stone-300" : "text-stone-500"}>
                O elemento <span className={`font-bold px-1 ${phase === 2 ? 'text-amber-400' : ''}`}>{words1[originIndex]}</span> começa a flutuar para a nova posição...
              </p>
            </motion.div>
          )}

          {phase >= 3 && (
            <motion.div key="3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4 items-center">
              <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">4</span>
              <p className="text-white">
                O espaço foi preenchido e a palavra transformou-se em <span className="text-blue-400 font-bold px-1 border-b-2 border-blue-400/30">{words2[resultIndex]}</span>.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* BOTÕES DE CONTROLE (Escondidos para o Aluno) */}
      {!isReadOnly && (
        <div className="flex flex-wrap gap-3 mt-10 items-center justify-center w-full max-w-2xl">
          <button onClick={onReplay} disabled={isSaving} className="bg-amber-400 hover:bg-amber-300 text-stone-950 px-6 py-3 rounded-xl font-bold transition-colors">
            ▶ Repetir Animação
          </button>
          <button onClick={onBack} disabled={isSaving} className="border border-white/10 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl transition-colors">
            ← Editar Palavras
          </button>
          <button onClick={onReset} disabled={isSaving} className="border border-white/10 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl transition-colors">
            Recomeçar
          </button>

          <div className="ml-auto">
            {savedSuccess ? (
              <span className="text-green-400 font-bold px-4 py-3 bg-green-400/10 rounded-xl border border-green-400/20">✓ Salvo na sua conta!</span>
            ) : (
              <button onClick={onSave} disabled={isSaving} className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20">
                {isSaving ? "Salvando..." : "💾 Salvar Aula"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}