import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import LoginPage from "@/app/login/page"

const pushMock = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}))

describe("Página de login", () => {
  beforeEach(() => {
    pushMock.mockReset()
  })

  it("renderiza os campos e o botão", () => {
    render(<LoginPage />)

    expect(
      screen.getByText("Entrar na conta"),
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/digite seu email/i),
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/digite sua senha/i),
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", {
        name: /entrar/i,
      }),
    ).toBeInTheDocument()
  })

  it("valida email inválido antes de chamar a API", async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()

    vi.stubGlobal("fetch", fetchMock)

    render(<LoginPage />)

    await user.type(
      screen.getByPlaceholderText(/digite seu email/i),
      "email-invalido",
    )

    await user.type(
      screen.getByPlaceholderText(/digite sua senha/i),
      "123456",
    )

    await user.click(
      screen.getByRole("button", {
        name: /entrar/i,
      }),
    )

    expect(
      screen.getByText("Email inválido"),
    ).toBeInTheDocument()

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("exige a senha", async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()

    vi.stubGlobal("fetch", fetchMock)

    render(<LoginPage />)

    await user.type(
      screen.getByPlaceholderText(/digite seu email/i),
      "teste@email.com",
    )

    await user.click(
      screen.getByRole("button", {
        name: /entrar/i,
      }),
    )

    expect(
      screen.getByText("Digite sua senha"),
    ).toBeInTheDocument()

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("exibe a mensagem retornada pela API quando o login falha", async () => {
    const user = userEvent.setup()

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,

      text: vi.fn().mockResolvedValue(
        "Email ou senha incorretos",
      ),
    })

    vi.stubGlobal("fetch", fetchMock)

    render(<LoginPage />)

    await user.type(
      screen.getByPlaceholderText(/digite seu email/i),
      "teste@email.com",
    )

    await user.type(
      screen.getByPlaceholderText(/digite sua senha/i),
      "senha-errada",
    )

    await user.click(
      screen.getByRole("button", {
        name: /entrar/i,
      }),
    )

    expect(
      await screen.findByText(
        "Email ou senha incorretos",
      ),
    ).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: "teste@email.com",
          senha: "senha-errada",
        }),
      },
    )
  })

  it("trata falha de conexão", async () => {
    const user = userEvent.setup()

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {})

    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(
        new Error("Sem conexão"),
      ),
    )

    render(<LoginPage />)

    await user.type(
      screen.getByPlaceholderText(/digite seu email/i),
      "teste@email.com",
    )

    await user.type(
      screen.getByPlaceholderText(/digite sua senha/i),
      "123456",
    )

    await user.click(
      screen.getByRole("button", {
        name: /entrar/i,
      }),
    )

    expect(
      await screen.findByText(
        "Erro ao conectar com o servidor",
      ),
    ).toBeInTheDocument()

    expect(consoleSpy).toHaveBeenCalled()
  })
})