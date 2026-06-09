import { beforeEach, describe, expect, it, vi } from "vitest"

const prismaMock = vi.hoisted(() => ({
  task: {
    create: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
    delete: vi.fn(),
  },
}))

const jwtMock = vi.hoisted(() => ({
  verify: vi.fn(),
}))

const cookiesMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/prisma", () => ({
  default: prismaMock,
}))

vi.mock("jsonwebtoken", () => ({
  default: jwtMock,
}))

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}))

import { DELETE as excluirTarefa } from "@/app/api/tarefas/[id]/route"
import { POST as criarTarefa } from "@/app/api/tarefas/criar/route"
import { GET as listarTarefas } from "@/app/api/tarefas/listar/route"

function configurarCookieComToken(
  token = "token-valido",
) {
  cookiesMock.mockResolvedValue({
    get: vi.fn().mockReturnValue({
      value: token,
    }),
  })
}

function configurarCookieSemToken() {
  cookiesMock.mockResolvedValue({
    get: vi.fn().mockReturnValue(undefined),
  })
}

function criarRequestJson(
  url: string,
  body: unknown,
) {
  return new Request(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(body),
  })
}

describe("API de tarefas", () => {
  beforeEach(() => {
    cookiesMock.mockReset()
    jwtMock.verify.mockReset()

    prismaMock.task.create.mockReset()
    prismaMock.task.findMany.mockReset()
    prismaMock.task.findFirst.mockReset()
    prismaMock.task.delete.mockReset()
  })

  describe("POST /api/tarefas/criar", () => {
    it("retorna 401 quando não existe token", async () => {
      configurarCookieSemToken()

      const request = criarRequestJson(
        "http://localhost/api/tarefas/criar",
        {
          titulo: "Estudar",
          descricao: "Revisar testes",
          data: "2026-06-20",
        },
      )

      const response = await criarTarefa(request)
      const body = await response.json()

      expect(response.status).toBe(401)

      expect(body).toEqual({
        message: "Usuário não autenticado",
      })

      expect(
        prismaMock.task.create,
      ).not.toHaveBeenCalled()
    })

    it("retorna 400 quando faltam campos", async () => {
      configurarCookieComToken()

      jwtMock.verify.mockReturnValue({
        id: "7",
        email: "teste@email.com",
      })

      const request = criarRequestJson(
        "http://localhost/api/tarefas/criar",
        {
          titulo: "Estudar",
          descricao: "",
          data: "2026-06-20",
        },
      )

      const response = await criarTarefa(request)
      const body = await response.json()

      expect(response.status).toBe(400)

      expect(body).toEqual({
        message: "Preencha todos os campos",
      })

      expect(
        prismaMock.task.create,
      ).not.toHaveBeenCalled()
    })

    it("cria uma tarefa para o usuário autenticado", async () => {
      configurarCookieComToken()

      jwtMock.verify.mockReturnValue({
        id: "7",
        email: "teste@email.com",
      })

      prismaMock.task.create.mockResolvedValue({
        id: 1,
        titulo: "Estudar",
        descricao: "Revisar testes",
        dataLimite: new Date("2026-06-20T12:00:00"),
        userId: 7n,
      })

      const request = criarRequestJson(
        "http://localhost/api/tarefas/criar",
        {
          titulo: "Estudar",
          descricao: "Revisar testes",
          data: "2026-06-20",
        },
      )

      const response = await criarTarefa(request)
      const body = await response.json()

      expect(response.status).toBe(201)

      expect(body).toEqual({
        message: "Tarefa criada com sucesso",
      })

      expect(
        prismaMock.task.create,
      ).toHaveBeenCalledWith({
        data: {
          titulo: "Estudar",
          descricao: "Revisar testes",
          dataLimite: new Date(
            "2026-06-20T12:00:00",
          ),
          userId: 7n,
        },
      })
    })

    it("retorna erro quando o token é inválido", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      configurarCookieComToken("token-invalido")

      jwtMock.verify.mockImplementation(() => {
        throw new Error("Token inválido")
      })

      const request = criarRequestJson(
        "http://localhost/api/tarefas/criar",
        {
          titulo: "Estudar",
          descricao: "Revisar testes",
          data: "2026-06-20",
        },
      )

      const response = await criarTarefa(request)
      const body = await response.json()

      expect(response.status).toBe(500)

      expect(body).toEqual({
        message: "Erro ao criar tarefa",
      })

      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe("GET /api/tarefas/listar", () => {
    it("retorna 401 quando não existe token", async () => {
      configurarCookieSemToken()

      const response = await listarTarefas()
      const body = await response.json()

      expect(response.status).toBe(401)

      expect(body).toEqual({
        message: "Usuário não autenticado",
      })

      expect(
        prismaMock.task.findMany,
      ).not.toHaveBeenCalled()
    })

    it("lista as tarefas do usuário autenticado", async () => {
      configurarCookieComToken()

      jwtMock.verify.mockReturnValue({
        id: "7",
        email: "teste@email.com",
      })

      prismaMock.task.findMany.mockResolvedValue([
        {
          id: 1,
          titulo: "Primeira tarefa",
          descricao: "Descrição da tarefa",
          dataLimite: new Date(
            "2026-06-20T12:00:00",
          ),
          userId: 7n,
        },
      ])

      const response = await listarTarefas()
      const body = await response.json()

      expect(response.status).toBe(200)

      expect(
        prismaMock.task.findMany,
      ).toHaveBeenCalledWith({
        where: {
          userId: 7n,
        },

        orderBy: {
          dataLimite: "asc",
        },
      })

      expect(body).toHaveLength(1)
      expect(body[0].titulo).toBe(
        "Primeira tarefa",
      )

      expect(body[0].userId).toBe("7")
    })
  })

  describe("DELETE /api/tarefas/:id", () => {
    it("retorna 400 para ID inválido", async () => {
      const request = new Request(
        "http://localhost/api/tarefas/abc",
        {
          method: "DELETE",
        },
      )

      const response = await excluirTarefa(
        request,
        {
          params: Promise.resolve({
            id: "abc",
          }),
        },
      )

      const body = await response.json()

      expect(response.status).toBe(400)

      expect(body).toEqual({
        message: "ID da tarefa é obrigatório",
      })
    })

    it("retorna 401 quando não existe token", async () => {
      configurarCookieSemToken()

      const request = new Request(
        "http://localhost/api/tarefas/1",
        {
          method: "DELETE",
        },
      )

      const response = await excluirTarefa(
        request,
        {
          params: Promise.resolve({
            id: "1",
          }),
        },
      )

      const body = await response.json()

      expect(response.status).toBe(401)

      expect(body).toEqual({
        message: "Não autenticado",
      })

      expect(
        prismaMock.task.delete,
      ).not.toHaveBeenCalled()
    })

    it("não permite excluir tarefa de outro usuário", async () => {
      configurarCookieComToken()

      jwtMock.verify.mockReturnValue({
        id: "7",
      })

      prismaMock.task.findFirst.mockResolvedValue(
        null,
      )

      const request = new Request(
        "http://localhost/api/tarefas/99",
        {
          method: "DELETE",
        },
      )

      const response = await excluirTarefa(
        request,
        {
          params: Promise.resolve({
            id: "99",
          }),
        },
      )

      const body = await response.json()

      expect(response.status).toBe(404)

      expect(body).toEqual({
        message: "Tarefa não encontrada",
      })

      expect(
        prismaMock.task.findFirst,
      ).toHaveBeenCalledWith({
        where: {
          id: 99,
          userId: 7n,
        },
      })

      expect(
        prismaMock.task.delete,
      ).not.toHaveBeenCalled()
    })

    it("exclui a tarefa do usuário autenticado", async () => {
      configurarCookieComToken()

      jwtMock.verify.mockReturnValue({
        id: "7",
      })

      prismaMock.task.findFirst.mockResolvedValue({
        id: 3,
        userId: 7n,
      })

      prismaMock.task.delete.mockResolvedValue({
        id: 3,
      })

      const request = new Request(
        "http://localhost/api/tarefas/3",
        {
          method: "DELETE",
        },
      )

      const response = await excluirTarefa(
        request,
        {
          params: Promise.resolve({
            id: "3",
          }),
        },
      )

      const body = await response.json()

      expect(response.status).toBe(200)

      expect(body).toEqual({
        message: "Deletada com sucesso",
      })

      expect(
        prismaMock.task.delete,
      ).toHaveBeenCalledWith({
        where: {
          id: 3,
        },
      })
    })
  })
})