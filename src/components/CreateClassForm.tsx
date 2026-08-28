"use client";

import { useState } from "react";
import { createClassAction } from "@/app/actions/classes";

export function CreateClassForm() {
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  // Função para tratar o texto do código enquanto o usuário digita
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove espaços e transforma em maiúsculas na hora!
    const formatted = e.target.value.toUpperCase().replace(/\s/g, "");
    setInviteCode(formatted);
  };

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const result = await createClassAction(formData);
    setLoading(false);

    if (result?.error) {
      alert("⚠️ " + result.error);
    } else {
      // Sucesso! Limpa o formulário (o Next.js já vai recarregar a lista de turmas no fundo)
      const form = document.getElementById("create-class-form") as HTMLFormElement;
      form.reset();
      setInviteCode("");
    }
  }

  return (
    <form id="create-class-form" action={onSubmit} className="flex gap-2">
      <input
        name="className"
        placeholder="Nome da Turma"
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400 outline-none"
        required
        disabled={loading}
      />
      <input
        name="inviteCode"
        value={inviteCode}
        onChange={handleCodeChange}
        placeholder="CÓDIGO"
        maxLength={10} // Evita códigos gigantes
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-28 text-white focus:border-amber-400 outline-none placeholder:normal-case font-mono"
        required
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-amber-400 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-300 transition-colors disabled:opacity-50"
      >
        {loading ? "Criando..." : "Criar Turma"}
      </button>
    </form>
  );
}