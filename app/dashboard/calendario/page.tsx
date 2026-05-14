"use client"

import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"


type Tarefa = {
  id: number
  titulo: string
  descricao: string
  dataLimite: string
}

export default function CalendarioPage() {
  const [eventos, setEventos] = useState([])

  async function carregarTarefas() {
    try {
      const resposta = await fetch("/api/tarefas/listar")

      const dados = await resposta.json()

      const tarefasFormatadas = dados.map((tarefa: Tarefa) => ({
        id: tarefa.id,
        title: tarefa.titulo,
        date: tarefa.dataLimite,
        extendedProps: {
          descricao: tarefa.descricao,
        },
      }))

      setEventos(tarefasFormatadas)
    } catch (erro) {
      console.error("Erro ao carregar tarefas:", erro)
    }
  }

  useEffect(() => {
    carregarTarefas()
  }, [])

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="rounded-xl border bg-zinc-950 p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">
          Calendário de tarefas
        </h1>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="pt-br"
          height="80vh"
          events={eventos}
          displayEventTime={false}
          eventClick={(info) => {
            alert(
              `Tarefa: ${info.event.title}\n\nDescrição: ${info.event.extendedProps.descricao}`
            )
          }}
        />
      </div>
    </div>
  )
}