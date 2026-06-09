import {
  act,
  render,
  screen,
  waitFor,
} from "@testing-library/react"

import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import CreateTaskPage from "@/app/dashboard/tarefa/adicionar/page"
import TarefasPage from "@/app/dashboard/tarefa/lista/page"

const pushMock = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}))

describe("Página de criação de tarefas", () => {
  beforeEach(() => {
    pushMock.mockReset()
  })

  it("valida os campos obrigatórios", async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()

    vi.stubGlobal("fetch", fetchMock)

    render(<CreateTaskPage />)

    await user.click(
      screen.getByRole("button", {
        name: /criar tarefa/i,
      }),
    )

    expect(
      screen.getByText("Digite o título da tarefa"),
    ).toBeInTheDocument()

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("cria a tarefa, mostra a mensagem e limpa os campos", async () => {
    const user = userEvent.setup()

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,

      json: vi.fn().mockResolvedValue({
        message: "Tarefa criada com sucesso",
      }),
    })

    vi.stubGlobal("fetch", fetchMock)

    render(<CreateTaskPage />)

    const titulo = screen.getByPlaceholderText(
      /digite o título da tarefa/i,
    )

    const descricao = screen.getByPlaceholderText(
      /digite a descrição da tarefa/i,
    )

    const data = document.querySelector(
      'input[type="date"]',
    ) as HTMLInputElement

    expect(data).not.toBeNull()

    await user.type(
      titulo,
      "Estudar testes",
    )

    await user.type(
      descricao,
      "Revisar Vitest e Testing Library",
    )

    await user.type(
      data,
      "2026-06-20",
    )

    await user.click(
      screen.getByRole("button", {
        name: /criar tarefa/i,
      }),
    )

    expect(
      await screen.findByText(
        "Tarefa criada com sucesso",
      ),
    ).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/tarefas/criar",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          titulo: "Estudar testes",
          descricao: "Revisar Vitest e Testing Library",
          data: "2026-06-20",
        }),
      },
    )

    expect(titulo).toHaveValue("")
    expect(descricao).toHaveValue("")
    expect(data).toHaveValue("")
  })
})

describe("Página de listagem de tarefas", () => {
  beforeEach(() => {
    pushMock.mockReset()
  })

  it("mostra a lista de tarefas", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,

      json: vi.fn().mockResolvedValue([
        {
          id: "1",
          titulo: "Entregar trabalho",
          descricao: "Finalizar os testes",
          dataLimite: "2026-06-20T12:00:00.000Z",
        },
      ]),
    })

    vi.stubGlobal("fetch", fetchMock)

    await act(async () => {
      render(<TarefasPage />)
    })

    expect(
      await screen.findByText("Entregar trabalho"),
    ).toBeInTheDocument()

    expect(
      screen.getByText("Finalizar os testes"),
    ).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/tarefas/listar",
    )
  })

  it("mostra mensagem quando não há tarefas", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,

      json: vi.fn().mockResolvedValue([]),
    })

    vi.stubGlobal("fetch", fetchMock)

    await act(async () => {
      render(<TarefasPage />)
    })

    expect(
      await screen.findByText(
        "Nenhuma tarefa encontrada.",
      ),
    ).toBeInTheDocument()
  })

  it("não exclui quando o usuário cancela", async () => {
    const user = userEvent.setup()

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,

      json: vi.fn().mockResolvedValue([
        {
          id: "1",
          titulo: "Tarefa protegida",
          descricao: "Descrição",
        },
      ]),
    })

    vi.stubGlobal("fetch", fetchMock)

    vi.spyOn(
      window,
      "confirm",
    ).mockReturnValue(false)

    await act(async () => {
      render(<TarefasPage />)
    })

    const botaoExcluir = await screen.findByRole(
      "button",
      {
        name: /excluir/i,
      },
    )

    await user.click(botaoExcluir)

    expect(
      screen.getByText("Tarefa protegida"),
    ).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("exclui e remove a tarefa da interface", async () => {
    const user = userEvent.setup()

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,

        json: vi.fn().mockResolvedValue([
          {
            id: "1",
            titulo: "Tarefa removível",
            descricao: "Descrição",
          },
        ]),
      })
      .mockResolvedValueOnce({
        ok: true,

        json: vi.fn().mockResolvedValue({
          message: "Deletada com sucesso",
        }),
      })

    vi.stubGlobal("fetch", fetchMock)

    vi.spyOn(
      window,
      "confirm",
    ).mockReturnValue(true)

    await act(async () => {
      render(<TarefasPage />)
    })

    expect(
      await screen.findByText("Tarefa removível"),
    ).toBeInTheDocument()

    const botaoExcluir = screen.getByRole(
      "button",
      {
        name: /excluir/i,
      },
    )

    await user.click(botaoExcluir)

    await waitFor(() => {
      expect(
        screen.queryByText("Tarefa removível"),
      ).not.toBeInTheDocument()
    })

    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/tarefas/1",
      {
        method: "DELETE",
      },
    )
  })
})