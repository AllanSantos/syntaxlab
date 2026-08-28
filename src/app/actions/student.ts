"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function linkTeacherAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const teacherCode = formData.get("teacherCode") as string;

  if (!teacherCode) return;

  // Tenta inserir a conexão no banco de dados
  const { error } = await supabase.from("student_teacher_connections").insert([
    {
      student_id: userId,
      teacher_id: teacherCode.trim(),
    },
  ]);

  if (error) {
    console.error("Erro ao vincular:", error);
    // Em um app real, você retornaria o erro para a tela, mas vamos manter simples por ora
  }

  // Isso força o Next.js a recarregar a página inicial para mostrar as aulas
  revalidatePath("/");
}