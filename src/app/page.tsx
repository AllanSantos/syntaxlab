import Link from "next/link";
import { UserButton } from '@clerk/nextjs';
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { createClassAction, enrollInClassAction } from "@/app/actions/classes";
import { CreateClassForm } from "@/components/CreateClassForm";

export default async function HomePage() {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Variáveis para armazenar os dados organizados
  let teacherClasses: any[] = [];
  let studentEnrollments: any[] = [];

  // LOGICA DO PROFESSOR: Buscar as suas turmas e as lições de cada uma
  if (role === "teacher" && userId) {
    const { data: classes } = await supabase
      .from("classes")
      .select(`*, phrase_swaps(*)`)
      .eq("teacher_id", userId);
    if (classes) teacherClasses = classes;
  }

  // LOGICA DO ALUNO: Buscar turmas matriculadas e as lições delas
  if (role === "student" && userId) {
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select(`class_id, classes(name, invite_code, teacher_id, phrase_swaps(*))`)
      .eq("student_id", userId);
    if (enrollments) studentEnrollments = enrollments;
  }

  return (
    <div className="min-h-screen bg-[#0f0e17] text-white flex flex-col">
      <div className="max-w-5xl mx-auto px-6 py-20 flex-1 w-full">

        {/* Header simplificado */}
        <div className="mb-16 flex justify-between items-center">
          <h1 className="font-['Playfair_Display'] text-3xl font-black">Syntax<span className="text-amber-400">Lab</span></h1>
          <UserButton />
        </div>

        {/* VISÃO DO PROFESSOR */}
        {role === "teacher" && (
          <div>
            <div className="flex justify-between items-end mb-12">
              <p className="text-xs tracking-[0.2em] uppercase text-stone-600">Gestão de Turmas</p>

              {/* Formulário rápido para criar turma */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
                <p className="text-xs tracking-[0.2em] uppercase text-stone-600">Gestão de Turmas</p>

                {/* Nosso novo componente inteligente e blindado contra erros! */}
                <CreateClassForm />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {teacherClasses.map((cls) => (
                <div key={cls.id} className="border border-white/5 bg-white/[0.02] rounded-2xl p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-['Playfair_Display'] font-bold text-amber-400">{cls.name}</h2>
                    <span className="text-xs font-mono bg-white/5 px-3 py-1 rounded border border-white/10 text-stone-400">Convite: {cls.invite_code}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cls.phrase_swaps?.map((lesson: any) => (
                      <div key={lesson.id} className="bg-white/5 p-4 rounded-xl text-sm border border-white/5">
                        <p className="font-bold truncate">{lesson.phrase_original}</p>
                        <p className="text-stone-500 truncate">→ {lesson.phrase_final}</p>
                      </div>
                    ))}
                    <Link href={`/phrase-swap?classId=${cls.id}`} className="border-2 border-dashed border-white/10 rounded-xl p-4 flex items-center justify-center text-stone-500 hover:border-amber-400/40 hover:text-amber-400 transition-all text-sm">
                      + Nova Atividade
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISÃO DO ALUNO */}
        {role === "student" && (
          <div>
            <div className="flex justify-between items-end mb-12">
              <p className="text-xs tracking-[0.2em] uppercase text-stone-600">Minhas Turmas</p>
              <form action={enrollInClassAction} className="flex gap-2">
                <input name="inviteCode" placeholder="Código da Turma" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" required />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-400 transition-colors">Entrar na Turma</button>
              </form>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {studentEnrollments.map((enroll) => (
                <div key={enroll.class_id}>
                  <h2 className="text-xl font-['Playfair_Display'] font-bold text-blue-400 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm font-sans">🏫</span>
                    {enroll.classes.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enroll.classes.phrase_swaps?.map((lesson: any) => (
                      <Link href={`/play/${lesson.id}`} key={lesson.id}>
                        <div className="border border-white/8 rounded-xl p-6 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-400/30 transition-all group">
                          <h3 className="font-bold text-white mb-2">Atividade de Sintaxe</h3>
                          <p className="text-stone-500 text-xs mb-4">"{lesson.phrase_original}"</p>
                          <div className="text-xs text-blue-400 font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-block">Iniciar →</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}