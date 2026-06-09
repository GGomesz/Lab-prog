import { beforeEach, describe, expect, it, vi } from "vitest"

const prismaMock = vi.hoisted(() => ({
  user: {
    findFirst: vi.fn(),
  },
}))

const bcryptMock = vi.hoisted(() => ({
  compare: vi.fn(),
}))

const jwtMock = vi.hoisted(() => ({
  sign: vi.fn(),
}))

vi.mock("@/lib/prisma", () => ({
  default: prismaMock,
}))

vi.mock("bcrypt", () => ({
  default: bcryptMock,
}))

vi.mock("jsonwebtoken", () => ({
  default: jwtMock,
}))

import { POST } from "@/app/api/auth/login/route"

function criarRequest(body: unknown) {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
}

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    prismaMock.user.findFirst.mockReset()
    bcryptMock.compare.mockReset()
    jwtMock.sign.mockReset()
  })

  it("retorna 400 quando o email não é informado", async () => {
    const response = await POST(
      criarRequest({
        senha: "123456",
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe("Email Inválido")

    expect(prismaMock.user.findFirst).not.toHaveBeenCalled()
  })

  it("retorna 400 quando a senha não é informada", async () => {
    const response = await POST(
      criarRequest({
        email: "teste@email.com",
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe("Senha Inválida")

    expect(prismaMock.user.findFirst).not.toHaveBeenCalled()
  })

  it("retorna 401 quando o usuário não existe", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null)

    const response = await POST(
      criarRequest({
        email: "inexistente@email.com",
        senha: "123456",
      }),
    )

    expect(response.status).toBe(401)
    expect(await response.text()).toBe("Email ou senha incorretos")

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: {
        email: "inexistente@email.com",
      },
    })
  })

  it("retorna 401 quando a senha está incorreta", async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: 1n,
      email: "teste@email.com",
      senha: "hash-salvo",
    })

    bcryptMock.compare.mockResolvedValue(false)

    const response = await POST(
      criarRequest({
        email: "teste@email.com",
        senha: "senha-errada",
      }),
    )

    expect(response.status).toBe(401)
    expect(await response.text()).toBe("Email ou senha incorretos")

    expect(bcryptMock.compare).toHaveBeenCalledWith(
      "senha-errada",
      "hash-salvo",
    )
  })

  it("autentica, cria o JWT e grava o cookie", async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: 10n,
      email: "teste@email.com",
      senha: "hash-salvo",
    })

    bcryptMock.compare.mockResolvedValue(true)
    jwtMock.sign.mockReturnValue("token-assinado")

    const response = await POST(
      criarRequest({
        email: "teste@email.com",
        senha: "123456",
      }),
    )

    expect(response.status).toBe(200)

    expect(await response.json()).toEqual({
      message: "Login válido",
    })

    expect(jwtMock.sign).toHaveBeenCalledWith(
      {
        id: "10",
        email: "teste@email.com",
      },
      "segredo",
      {
        expiresIn: "300s",
      },
    )

    const cookie = response.headers.get("set-cookie")

    expect(cookie).toContain("token=token-assinado")
    expect(cookie).toContain("HttpOnly")
    expect(cookie).toContain("Path=/")
  })
})