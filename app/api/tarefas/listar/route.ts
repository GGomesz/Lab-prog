import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
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

    const tarefas = await prisma.task.findMany({
      where: {
        userId: BigInt(decoded.id),
      },
      orderBy: {
        dataLimite: "asc",
      },
    })

    const tarefasConvertidas = tarefas.map((tarefa) => ({
      ...tarefa,
      userId: tarefa.userId.toString(),
    }))

    return NextResponse.json(tarefasConvertidas)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: "Erro ao buscar tarefas" },
      { status: 500 }
    )
  }
}