"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Evento = {
  id: string;
  title: string;
  date: string;
};

export default function CalendarioFaculdade() {
  const corEscura = "#1f2937";

  useEffect(() => {
    document.documentElement.style.backgroundColor = corEscura;
    document.body.style.backgroundColor = corEscura;
    return () => {
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [eventos, setEventos] = useState<Evento[]>([
    { id: "1", title: "Prova de Algoritmos", date: "2026-04-20" },
  ]);

  // Função para adicionar pelo formulário lateral
  function adicionarEvento(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!titulo.trim() || !data) return;

    const novoEvento: Evento = {
      id: crypto.randomUUID(),
      title: titulo,
      date: data,
    };

    setEventos((prev) => [...prev, novoEvento]);
    setTitulo("");
    setData("");
  }

  // NOVA FUNÇÃO: Adicionar ao clicar na data
  function handleDateClick(info: any) {
    const nomeEvento = prompt(`Adicionar evento para o dia ${info.dateStr}:`);
    
    if (nomeEvento && nomeEvento.trim() !== "") {
      const novoEvento: Evento = {
        id: crypto.randomUUID(),
        title: nomeEvento,
        date: info.dateStr,
      };
      setEventos((prev) => [...prev, novoEvento]);
    }
  }

  function removerEvento(id: string) {
    if (confirm("Remover esta atividade?")) {
      setEventos((prev) => prev.filter((evento) => evento.id !== id));
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <Card className="shadow-sm border-none bg-white">
            <CardContent className="pt-6">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locales={allLocales}
                locale="pt-br"
                buttonText={{
                  today: "Hoje",
                  month: "Mês",
                  week: "Semana",
                  day: "Dia",
                }}
                events={eventos}
                height="auto"
                dateClick={handleDateClick} // Usando a nova função aqui
                eventClick={(info) => removerEvento(info.event.id)}
              />
            </CardContent>
          </Card>

          <Card className="h-fit shadow-sm border-none bg-white">
            <CardHeader>
              <CardTitle>Adicionar atividade</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-muted-foreground">Atividade</p>
                <Input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Prova de Cálculo"
                  className="bg-muted/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-muted-foreground">Data</p>
                <Input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="bg-muted/50"
                />
              </div>

              <Button className="w-full" onClick={() => adicionarEvento()}>
                Adicionar
              </Button>

              <div className="mt-4">
                <p className="mb-2 text-sm font-bold border-b pb-2">Cadastradas</p>
                <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                  {eventos.map((evento) => (
                    <li key={evento.id} className="flex items-center justify-between rounded-md border p-2 text-sm bg-gray-50 shadow-sm">
                      <div className="overflow-hidden">
                        <p className="font-semibold text-foreground truncate">{evento.title}</p>
                        <p className="text-xs text-muted-foreground">{evento.date}</p>
                      </div>
                      <button
                        onClick={() => removerEvento(evento.id)}
                        className="text-red-500 hover:text-red-700 font-medium ml-2"
                      >
                        Apagar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}