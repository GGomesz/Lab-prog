"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function CreateTaskPage() {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [data, setData] = useState("")
  const [mensagem, setMensagem] = useState("")

  async function handleCreateTask() {
    setMensagem("")

    if (!titulo) {
      setMensagem("Digite o título da tarefa")
      return
    }

    if (!descricao) {
      setMensagem("Digite a descrição da tarefa")
      return
    }

    if (!data) {
      setMensagem("Selecione uma data")
      return
    }

    try {
      const resposta = await fetch("/api/tarefas/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo,
          descricao,
          data,
        }),
      })

      const resultado = await resposta.json()

      setMensagem(resultado.message)

      setTitulo("")
      setDescricao("")
      setData("")
    } catch (erro) {
      console.error("Erro ao criar tarefa:", erro)
      setMensagem("Erro ao conectar com o servidor")
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Criar tarefa</CardTitle>
          <CardDescription>
            Preencha os dados para adicionar uma nova tarefa
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p>Título</p>

            <div className="flex items-center gap-2 rounded-md border pl-4">
              <i className="bx bxs-edit"></i>

              <Input
                type="text"
                placeholder="Digite o título da tarefa"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p>Descrição</p>

            <textarea
              placeholder="Digite a descrição da tarefa"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="min-h-[120px] rounded-md border p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <p>Data limite</p>

            <div className="flex items-center gap-2 rounded-md border pl-4">
              <i className="bx bxs-calendar"></i>

              <Input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <Button onClick={handleCreateTask}>
            Criar tarefa
          </Button>

          {mensagem && (
            <p className="text-sm text-center">
              {mensagem}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}