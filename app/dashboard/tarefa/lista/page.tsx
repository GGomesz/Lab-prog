"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  dataLimite?: string;
};

export default function TarefasPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  async function carregarTarefas() {
    try {
      setLoading(true);

      const res = await fetch("/api/tarefas/listar");

      if (!res.ok) {
        throw new Error("Erro ao buscar tarefas");
      }

      const data = await res.json();
      setTarefas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deletarTarefa(id: string) {
    const confirmacao = window.confirm("Deseja excluir esta tarefa?");
    if (!confirmacao) return;

    const res = await fetch(`/api/tarefas/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setTarefas((prev) => prev.filter((t) => t.id !== id));
    }
  }

  function editarTarefa(id: string) {
    router.push(`/tarefas/editar/${id}`);
  }

  useEffect(() => {
    carregarTarefas();
  }, []);

  if (loading) {
    return <p>Carregando tarefas...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Minhas Tarefas</h1>

      {tarefas.length === 0 ? (
        <p>Nenhuma tarefa encontrada.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tarefas.map((tarefa) => (
            <li
              key={tarefa.id}
              style={{
                border: "1px solid #ccc",
                marginBottom: 10,
                padding: 10,
                borderRadius: 8,
              }}
            >
              <h3>{tarefa.titulo}</h3>

              <p>{tarefa.descricao}</p>

              <p>
                <strong>Data limite:</strong>{" "}
                {tarefa.dataLimite
                  ? new Date(tarefa.dataLimite).toLocaleDateString()
                  : "Sem data"}
              </p>

              <div style={{ display: "flex", gap: 10 }}>

                <button
                  onClick={() => deletarTarefa(tarefa.id)}
                  style={{ color: "red" }}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}