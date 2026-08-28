"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { AnimationStage } from "@/components/phrase-swap/AnimationStage";
import Link from "next/link";

export default function PlayLessonPage() {
  const params = useParams();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0); // Para poder repetir a animação

  useEffect(() => {
    async function fetchLesson() {
      const { data } = await getSupabase()
        .from("phrase_swaps")
        .select("*")
        .eq("id", lessonId)
        .single();

      setLesson(data);
      setLoading(false);
    }
    if (lessonId) fetchLesson();
  }, [lessonId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0e17] flex items-center justify-center text-amber-400 font-['Playfair_Display'] text-2xl animate-pulse">
        Carregando atividade...
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#0f0e17] flex flex-col items-center justify-center text-white">
        <p className="text-xl mb-4">Atividade não encontrada.</p>
        <Link href="/" className="text-blue-400 hover:underline">← Voltar ao painel</Link>
      </div>
    );
  }

  // Transformamos as frases salvas de volta em arrays de palavras para a animação
  const words1 = lesson.phrase_original.trim().split(/\s+/);
  const words2 = lesson.phrase_final.trim().split(/\s+/);

  return (
    <div className="min-h-screen bg-[#0f0e17] text-white flex flex-col">
      <div className="max-w-3xl mx-auto px-6 py-16 w-full flex-1">

        {/* Header do Player */}
        <div className="mb-16">
          <Link href="/" className="text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-white transition-colors mb-6 inline-block">
            ← Voltar para minhas tarefas
          </Link>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-black text-white leading-tight">
            Análise de <span className="text-blue-400">Transformação</span>
          </h1>
          <p className="text-stone-500 text-sm mt-2">
            Observe atentamente como os elementos da frase se comportam.
          </p>
        </div>

        {/* O Palco Mágico sendo reutilizado! */}
        <div className="mt-12 pointer-events-none">
          {/* Bloqueamos cliques (pointer-events-none) para o aluno apenas assistir, se desejar. */}
          <AnimationStage
            words1={words1}
            words2={words2}
            explodeIndex={lesson.explode_index}
            originIndex={lesson.origin_index}
            resultIndex={lesson.result_index}
            animationKey={animationKey}
            onReplay={() => setAnimationKey(prev => prev + 1)}
            onBack={() => { }}
            onReset={() => { }}
            isReadOnly={true}
          />
        </div>

        {/* Controles customizados do Aluno */}
        <div className="flex justify-center mt-12 gap-4">
          <button
            onClick={() => setAnimationKey(prev => prev + 1)}
            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-6 py-3 rounded-lg font-bold transition-colors"
          >
            ▶ Repetir Animação
          </button>
        </div>

      </div>
    </div>
  );
}