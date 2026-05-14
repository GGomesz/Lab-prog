import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()

    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, "segredo") as {
      id: string
      email: string
    }

    const body = await request.json()

    const { titulo, descricao, data } = body

    if (!titulo || !descricao || !data) {
      return NextResponse.json(
        { message: "Preencha todos os campos" },
        { status: 400 }
      )
    }

    await prisma.task.create({
      data: {
        titulo,
        descricao,
        dataLimite: new Date(data + "T12:00:00"),
        userId: BigInt(decoded.id),
      },
    })

    return NextResponse.json(
      { message: "Tarefa criada com sucesso" },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: "Erro ao criar tarefa" },
      { status: 500 }
    )
  }
}