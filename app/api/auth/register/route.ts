import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const email = data.email
    const senha = data.senha

    if (!email) {
      return new Response("Email Inválido")
    }

    if (!senha) {
      return new Response("Senha Inválida")
    }

    const saltRounds = 10
    const senhaHash = await bcrypt.hash(senha, saltRounds)

    await prisma.user.create({
      data: {
        email,
        senha: senhaHash,
      },
    })

    return new Response("Cadastro válido")
  } catch (error: any) {
    if (error.code === "P2002") {
      return new Response("Email já cadastrado")
    }

    console.error(error)
    return new Response("Erro interno no servidor")
  }
}
