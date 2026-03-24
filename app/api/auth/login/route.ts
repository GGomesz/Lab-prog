import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const data = await request.json()

  const email = data.email
  const senha = data.senha

  if (!email) {
    return new Response("Email Inválido")
  }

  if (!senha) {
    return new Response("Senha Inválida")
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  if (!user) {
    return new Response("Email ou senha incorretos")
  }

  const senhaCorreta = await bcrypt.compare(senha, user.senha)

  if (!senhaCorreta) {
    return new Response("Email ou senha incorretos")
  }

  return new Response("Login Válido")
}
