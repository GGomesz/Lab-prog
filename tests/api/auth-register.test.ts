import { beforeEach, describe, expect, it, vi } from "vitest"

const prismaMock = vi.hoisted(() => ({
  user: {
    create: vi.fn(),
  },
}))

const bcryptMock = vi.hoisted(() => ({
  hash: vi.fn(),
}))

vi.mock("@/lib/prisma", () => ({
  default: prismaMock,
}))

vi.mock("bcrypt", () => ({
  default: bcryptMock,
}))

import { POST } from "@/app/api/auth/register/route"

function criarRequest(body: unknown) {
  return new Request("http://localhost/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
}

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    prismaMock.user.create.mockReset()
    bcryptMock.hash.mockReset()
  })

  it("rejeita cadastro sem email", async () => {
    const response = await POST(
      criarRequest({
        senha: "123456",
      }),
    )

    expect(await response.text()).toBe("Email Inválido")

    expect(bcryptMock.hash).not.toHaveBeenCalled()
    expect(prismaMock.user.create).not.toHaveBeenCalled()
  })

  it("rejeita cadastro sem senha", async () => {
    const response = await POST(
      criarRequest({
        email: "teste@email.com",
      }),
    )

    expect(await response.text()).toBe("Senha Inválida")

    expect(bcryptMock.hash).not.toHaveBeenCalled()
    expect(prismaMock.user.create).not.toHaveBeenCalled()
  })

  it("gera o hash e cria o usuário", async () => {
    bcryptMock.hash.mockResolvedValue("senha-hash")

    prismaMock.user.create.mockResolvedValue({
      id: 1n,
      email: "teste@email.com",
      senha: "senha-hash",
    })

    const response = await POST(
      criarRequest({
        email: "teste@email.com",
        senha: "123456",
      }),
    )

    expect(await response.text()).toBe("Cadastro válido")

    expect(bcryptMock.hash).toHaveBeenCalledWith("123456", 10)

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        email: "teste@email.com",
        senha: "senha-hash",
      },
    })
  })

  it("informa quando o email já está cadastrado", async () => {
    bcryptMock.hash.mockResolvedValue("senha-hash")

    prismaMock.user.create.mockRejectedValue({
      code: "P2002",
    })

    const response = await POST(
      criarRequest({
        email: "duplicado@email.com",
        senha: "123456",
      }),
    )

    expect(await response.text()).toBe("Email já cadastrado")
  })

  it("trata erro inesperado do servidor", async () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {})

    bcryptMock.hash.mockRejectedValue(
      new Error("Falha inesperada"),
    )

    const response = await POST(
      criarRequest({
        email: "teste@email.com",
        senha: "123456",
      }),
    )

    expect(await response.text()).toBe("Erro interno no servidor")
    expect(consoleSpy).toHaveBeenCalled()
  })
})