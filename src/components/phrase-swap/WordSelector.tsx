"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface WordSelectorProps {
  words1: string[];
  words2: string[];
  explodeIndex: number | null;
  originIndex: number | null;
  resultIndex: number | null;
  onSelectExplode: (i: number) => void;
  onSelectOrigin: (i: number) => void;
  onSelectResult: (i: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export function WordSelector({
  words1, words2, explodeIndex, originIndex, resultIndex,
  onSelectExplode, onSelectOrigin, onSelectResult, onConfirm, onBack
}: WordSelectorProps) {
  const ready = explodeIndex !== null && originIndex !== null && resultIndex !== null;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-8">
        <WordRow label="1. Qual palavra vai EXPLODIR? 💥" words={words1} selected={explodeIndex} onSelect={onSelectExplode} color="text-red-400" theme="red" />
        <WordRow label="2. Qual palavra vai VOAR? ✈️" words={words1} selected={originIndex} onSelect={onSelectOrigin} color="text-amber-400" theme="amber" />
        <WordRow label="3. No que ela se TRANSFORMA? 🪄" words={words2} selected={resultIndex} onSelect={onSelectResult} color="text-amber-400" theme="amber" />
      </div>

      {ready && (
        <div className="flex flex-wrap items-center gap-2 text-base bg-amber-400/5 border border-amber-400/10 rounded-xl px-6 py-4">
          <span className="text-stone-400">A palavra</span>
          <span className="text-amber-400 font-bold">{words1[originIndex]}</span>
          <span className="text-stone-400">voa, explode</span>
          <span className="text-red-400 font-bold line-through decoration-red-400/50">{words1[explodeIndex]}</span>
          <span className="text-stone-400">e vira</span>
          <span className="text-amber-400 font-bold underline decoration-amber-400/30">{words2[resultIndex]}</span>
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={onConfirm} disabled={!ready}>Ver animação →</Button>
        <Button variant="ghost" onClick={onBack}>← Voltar</Button>
      </div>
    </div>
  );
}

function WordRow({ label, words, selected, onSelect, color, theme }: any) {
  return (
    <div>
      <p className={cn("text-[10px] tracking-[0.2em] uppercase mb-4 font-bold", color)}>{label}</p>
      <div className="flex flex-wrap gap-2">
        {words.map((w: string, i: number) => (
          <button
            key={i} onClick={() => onSelect(i)}
            className={cn(
              "px-4 py-2 rounded-lg border transition-all font-[family-name:var(--font-playfair)] text-xl font-bold",
              selected === i
                ? theme === "red" ? "bg-red-500/20 border-red-500 text-red-300" : "bg-amber-400/20 border-amber-400 text-amber-300"
                : "bg-white/5 border-white/5 text-stone-500 hover:border-white/20 hover:text-white"
            )}
          >{w}</button>
        ))}
      </div>
    </div>
  );
}