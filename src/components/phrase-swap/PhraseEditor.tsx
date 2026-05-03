"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PhraseEditorProps {
  initialPhrase1?: string;
  initialPhrase2?: string;
  onConfirm: (phrase1: string, phrase2: string) => void;
}

export function PhraseEditor({
  initialPhrase1 = "",
  initialPhrase2 = "",
  onConfirm,
}: PhraseEditorProps) {
  const [phrase1, setPhrase1] = useState(initialPhrase1);
  const [phrase2, setPhrase2] = useState(initialPhrase2);

  const canContinue = phrase1.trim().length > 0 && phrase2.trim().length > 0;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-stone-500 mb-6">
          Passo 1 — Escreva as duas frases
        </p>
        <p className="text-stone-400 text-sm leading-relaxed max-w-lg">
          Escreva duas frases com o mesmo significado, mas com estruturas diferentes.
          Na próxima etapa você vai marcar quais palavras se transformam.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <PhraseInput
          label="A"
          value={phrase1}
          onChange={setPhrase1}
          placeholder="She went out of the room storming"
        />
        <PhraseInput
          label="B"
          value={phrase2}
          onChange={setPhrase2}
          placeholder="She stormed out of the room"
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => onConfirm(phrase1, phrase2)}
          disabled={!canContinue}
        >
          Marcar palavras →
        </Button>
      </div>
    </div>
  );
}

function PhraseInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="shrink-0 w-8 h-8 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-400 text-xs font-bold flex items-center justify-center">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "flex-1 bg-white/[0.03] border border-white/10 rounded-lg",
          "px-4 py-3 text-base text-white placeholder-white/20",
          "outline-none transition-colors duration-200",
          "focus:border-amber-400/40",
          "font-[family-name:var(--font-playfair)] italic"
        )}
      />
    </div>
  );
}