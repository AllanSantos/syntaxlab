"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowsUpFromLine } from "lucide-react"; // npm install lucide-react se necessário
import { cn } from "@/lib/utils";

interface PhraseEditorProps {
  initialPhrase1: string;
  initialPhrase2: string;
  onConfirm: (p1: string, p2: string) => void;
  onSwap: () => void;
}

export function PhraseEditor({ initialPhrase1, initialPhrase2, onConfirm, onSwap }: PhraseEditorProps) {
  const [p1, setP1] = useState(initialPhrase1);
  const [p2, setP2] = useState(initialPhrase2);

  useEffect(() => { setP1(initialPhrase1); setP2(initialPhrase2); }, [initialPhrase1, initialPhrase2]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5 relative">
        <PhraseInput label="Original" value={p1} onChange={setP1} placeholder="She took the pod up picking" />

        <button
          onClick={() => { onSwap(); const tmp = p1; setP1(p2); setP2(tmp); }}
          className="absolute right-12 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-stone-800 border border-white/10 flex items-center justify-center hover:bg-stone-700 transition-colors"
          title="Inverter frases"
        >
          <span className="text-amber-400 text-xs">↕</span>
        </button>

        <PhraseInput label="Final" value={p2} onChange={setP2} placeholder="She picked the pod up" />
      </div>

      <Button onClick={() => onConfirm(p1, p2)} disabled={!p1.trim() || !p2.trim()}>
        Próximo passo →
      </Button>
    </div>
  );
}

function PhraseInput({ label, value, onChange, placeholder }: any) {
  return (
    <div className="flex items-center gap-4">
      <span className="shrink-0 w-24 text-[10px] uppercase tracking-widest text-stone-500 font-bold">{label}</span>
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-400/40 outline-none font-[family-name:var(--font-playfair)] italic"
      />
    </div>
  );
}