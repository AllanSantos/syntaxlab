"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface WordSelectorProps {
  words1: string[];
  words2: string[];
  sourceIndex: number | null;
  targetIndex: number | null;
  onSelectSource: (i: number) => void;
  onSelectTarget: (i: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export function WordSelector({
  words1,
  words2,
  sourceIndex,
  targetIndex,
  onSelectSource,
  onSelectTarget,
  onConfirm,
  onBack,
}: WordSelectorProps) {
  const canAnimate = sourceIndex !== null && targetIndex !== null;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-stone-500 mb-6">
          Passo 2 — Marque as palavras
        </p>
        <div className="flex flex-col gap-2 text-sm text-stone-400 leading-relaxed">
          <p>
            Na <span className="text-amber-400 font-medium">frase B</span>, clique na palavra que vai{" "}
            <span className="text-amber-400 font-medium">voar e se transformar</span>{" "}
            <span className="text-stone-600">(ex: storming)</span>
          </p>
          <p>
            Na <span className="text-red-400 font-medium">frase A</span>, clique na palavra que vai{" "}
            <span className="text-red-400 font-medium">explodir e ser substituída</span>{" "}
            <span className="text-stone-600">(ex: went)</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Frase B primeiro — a palavra que voa */}
        <WordRow
          label="Frase B — palavra que vai voar"
          labelColor="text-amber-400"
          words={words2}
          selectedIndex={sourceIndex}
          onSelect={onSelectSource}
          variant="source"
        />
        {/* Frase A — a palavra que explode */}
        <WordRow
          label="Frase A — palavra que vai explodir"
          labelColor="text-red-400"
          words={words1}
          selectedIndex={targetIndex}
          onSelect={onSelectTarget}
          variant="target"
        />
      </div>

      {canAnimate && (
        <div className="flex items-center gap-3 text-sm bg-white/[0.03] border border-white/[0.07] rounded-lg px-4 py-3">
          <span className="text-amber-400 font-medium">{words2[sourceIndex!]}</span>
          <span className="text-stone-600">voa até</span>
          <span className="text-red-400 font-medium">{words1[targetIndex!]}</span>
          <span className="text-stone-600">e vira</span>
          <span className="text-amber-400 font-medium">{words2[sourceIndex!]}</span>
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={onConfirm} disabled={!canAnimate}>
          Ver animação →
        </Button>
        <Button variant="ghost" onClick={onBack}>
          ← Voltar
        </Button>
      </div>
    </div>
  );
}

function WordRow({
  label,
  labelColor,
  words,
  selectedIndex,
  onSelect,
  variant,
}: {
  label: string;
  labelColor: string;
  words: string[];
  selectedIndex: number | null;
  onSelect: (i: number) => void;
  variant: "source" | "target";
}) {
  return (
    <div>
      <p className={cn("text-xs tracking-widest uppercase mb-4", labelColor)}>
        {label}
      </p>
      <div className="flex flex-wrap gap-3">
        {words.map((word, i) => {
          const isSelected = selectedIndex === i;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={cn(
                "font-[family-name:var(--font-playfair)] text-2xl font-bold px-4 py-2 rounded-lg border transition-all duration-200",
                "hover:scale-105 active:scale-95 cursor-pointer",
                !isSelected &&
                "text-white/70 border-white/10 bg-white/[0.03] hover:border-white/25 hover:text-white",
                isSelected &&
                variant === "source" &&
                "text-amber-300 border-amber-400/50 bg-amber-400/10",
                isSelected &&
                variant === "target" &&
                "text-red-300 border-red-500/50 bg-red-500/10"
              )}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}