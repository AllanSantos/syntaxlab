"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Professor cria uma turma
export async function createClassAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const className = formData.get("className") as string;
  const inviteCode = formData.get("inviteCode") as string;
  const cleanCode = inviteCode.trim().toUpperCase().replace(/\s+/g, '');

  const { error } = await supabase.from("classes").insert([
    {
      name: className,
      teacher_id: userId,
      invite_code: cleanCode
    },
  ]);

  if (error) {
    // Código 23505 é o padrão do banco de dados para "Unique violation" (Duplicidade)
    if (error.code === '23505') {
      return { error: "Este código de convite já está sendo usado. Escolha outro!" };
    }
    return { error: "Ocorreu um erro ao criar a turma." };
  }
  revalidatePath("/");
}

// Aluno entra numa turma pelo código
export async function enrollInClassAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const inviteCode = formData.get("inviteCode") as string;

  // 1. Procura a turma pelo código de convite
  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select("id")
    .eq("invite_code", inviteCode.trim().toUpperCase())
    .single();

  if (!classData || classError) throw new Error("Turma não encontrada");

  // 2. Matricula o aluno
  const { error: enrollError } = await supabase.from("enrollments").insert([
    {
      student_id: userId,
      class_id: classData.id,
    },
  ]);

  if (enrollError) console.error("Erro na matrícula:", enrollError);
  revalidatePath("/");
}