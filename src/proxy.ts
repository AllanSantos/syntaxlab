import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 1. Agora, APENAS as telas de login e cadastro são públicas.
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    // Se a rota não for pública, o Clerk barra e manda para o /sign-in automaticamente
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}