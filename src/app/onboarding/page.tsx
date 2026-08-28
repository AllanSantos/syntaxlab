import { setRoleAction } from "@/app/actions/user";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#0f0e17] flex flex-col items-center justify-center text-white px-6">
      <div className="max-w-md w-full text-center mb-10">
        <h1 className="font-['Playfair_Display'] text-3xl font-black mb-4">
          Bem-vindo ao Syntax<span className="text-amber-400">Lab</span>!
        </h1>
        <p className="text-stone-400 text-sm">
          Para personalizarmos a sua experiência, conte-nos como você vai usar a plataforma:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        {/* Opção Professor */}
        <form action={setRoleAction}>
          <input type="hidden" name="role" value="teacher" />
          <button
            type="submit"
            className="w-full text-left group border border-white/10 rounded-2xl p-6 bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-400/40 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center text-xl">
                👨‍🏫
              </div>
              <div>
                <h2 className="font-bold text-lg group-hover:text-amber-400 transition-colors">Sou Professor</h2>
                <p className="text-stone-500 text-xs mt-1">Quero criar animações e materiais interativos para meus alunos.</p>
              </div>
            </div>
          </button>
        </form>

        {/* Opção Aluno */}
        <form action={setRoleAction}>
          <input type="hidden" name="role" value="student" />
          <button
            type="submit"
            className="w-full text-left group border border-white/10 rounded-2xl p-6 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-400/40 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-400/10 flex items-center justify-center text-xl">
                🎒
              </div>
              <div>
                <h2 className="font-bold text-lg group-hover:text-blue-400 transition-colors">Sou Aluno</h2>
                <p className="text-stone-500 text-xs mt-1">Fui convidado para realizar exercícios e ver as aulas.</p>
              </div>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}