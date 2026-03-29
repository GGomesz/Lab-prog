import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const data = await request.json()

  const email = data.email
  const senha = data.senha

  if (!email) {
    return new Response("Email Inválido", { status: 400 })
  }

  if (!senha) {
    return new Response("Senha Inválida", { status: 400 })
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  if (!user) {
    return new Response("Email ou senha incorretos", { status: 401 })
  }

  const senhaCorreta = await bcrypt.compare(senha, user.senha)

  if (!senhaCorreta) {
    return new Response("Email ou senha incorretos", { status: 401 })
  }

  // CRIA O TOKEN
  const token = jwt.sign(
    { id: user.id.toString(), email: user.email },
    "segredo",
    { expiresIn: "300s" }
  )

  const response = NextResponse.json({ message: "Login válido" })

  // SALVA O COOKIE
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 300,
  })

  return response
}
