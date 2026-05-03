import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f0e17] text-white flex flex-col">
      <div className="max-w-4xl mx-auto px-6 py-20 flex-1">
        {/* Logo */}
        <div className="mb-20">
          <h1 className="font-['Playfair_Display'] text-3xl font-black tracking-tight">
            Syntax<span className="text-amber-400">Lab</span>
          </h1>
          <p className="text-stone-500 text-sm mt-2">
            Ferramentas visuais para o ensino de inglês
          </p>
        </div>

        {/* Tools grid */}
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-stone-600 mb-8">
            Ferramentas disponíveis
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/phrase-swap">
              <div className="group border border-white/8 rounded-2xl p-8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-400/30 transition-all duration-300 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-6">
                  <span className="text-amber-400 text-lg font-['Playfair_Display'] font-black">→</span>
                </div>
                <h2 className="font-['Playfair_Display'] text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                  Phrase Swap
                </h2>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Mostre como palavras se transformam entre frases de mesmo
                  significado. Animação visual letra a letra.
                </p>
                <div className="mt-6 text-xs text-amber-400/60 tracking-widest uppercase">
                  Disponível →
                </div>
              </div>
            </Link>

            {/* Placeholder for future tools */}
            <div className="border border-white/5 rounded-2xl p-8 bg-white/[0.01] opacity-40 cursor-not-allowed">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <span className="text-stone-600 text-lg">+</span>
              </div>
              <h2 className="font-['Playfair_Display'] text-xl font-bold text-stone-600 mb-3">
                Em breve
              </h2>
              <p className="text-stone-700 text-sm leading-relaxed">
                Novas ferramentas de visualização linguística serão adicionadas
                em futuras versões.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/5 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-stone-700 text-xs">
            SyntaxLab — Plataforma de ensino visual de inglês
          </p>
        </div>
      </footer>
    </div>
  );
}