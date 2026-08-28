import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0e17]">
      <SignUp

        fallbackRedirectUrl="/onboarding"

        appearance={{
          elements: {
            card: "bg-stone-900 border border-white/10 shadow-2xl",
            headerTitle: "text-white font-['Playfair_Display'] text-2xl",
            headerSubtitle: "text-stone-400",
            formButtonPrimary: "bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold",
            socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
            formFieldLabel: "text-stone-300",
            formFieldInput: "bg-white/5 border border-white/10 text-white focus:border-amber-400/40",
            footerActionLink: "text-amber-400 hover:text-amber-300",
            identityPreviewText: "text-stone-300",
            identityPreviewEditButton: "text-amber-400 hover:text-amber-300"
          }
        }}
      />
    </div>
  );
}