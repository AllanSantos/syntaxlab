"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function setRoleAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const role = formData.get("role") as string;

  // Atualiza o banco de dados interno do Clerk com a escolha do usuário
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: role,
    },
  });

  // Após salvar, manda o usuário para a tela inicial
  redirect("/");
}