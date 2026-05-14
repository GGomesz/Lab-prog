import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: any } // Usando any temporariamente para evitar conflito de tipagem do Next
) {
  try {
    // 1. Garanta que o ID foi extraído corretamente
    const resolvedParams = await params; 
    const taskId = parseInt(resolvedParams.id);

    if (!taskId || isNaN(taskId)) {
      return NextResponse.json({ message: "ID da tarefa é obrigatório" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, "segredo") as { id: string };

    // 2. Busca a tarefa garantindo que os tipos batam
    const tarefa = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: BigInt(decoded.id),
      },
    });

    if (!tarefa) {
      return NextResponse.json({ message: "Tarefa não encontrada" }, { status: 404 });
    }

    // 3. Deleta usando o ID confirmado
    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ message: "Deletada com sucesso" });
    
  } catch (error: any) {
    console.error("ERRO:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
