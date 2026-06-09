import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import RegisterPage from "@/app/register/page"

const pushMock = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}))

describe("Página de cadastro", () => {
  beforeEach(() => {
    pushMock.mockReset()
  })

  it("renderiza os campos da página", () => {
    render(<RegisterPage />)

    expect(
      screen.getByPlaceholderText(/digite seu email/i),
    ).toBeInTheDocument()

    const camposSenha =
      screen.getAllByPlaceholderText(/digite sua senha/i)

    expect(camposSenha).toHaveLength(2)

    expect(
      screen.getByRole("button", {
        name: /cadastrar/i,
      }),
    ).toBeInTheDocument()
  })

  it("valida email inválido", async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()

    vi.stubGlobal("fetch", fetchMock)

    render(<RegisterPage />)

    const camposSenha =
      screen.getAllByPlaceholderText(/digite sua senha/i)

    await user.type(
      screen.getByPlaceholderText(/digite seu email/i),
      "email-invalido",
    )

    await user.type(
      camposSenha[0],
      "123456",
    )

    await user.type(
      camposSenha[1],
      "123456",
    )

    await user.click(
      screen.getByRole("button", {
        name: /cadastrar/i,
      }),
    )

    expect(
      screen.getByText("Email inválido"),
    ).toBeInTheDocument()

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("não permite senhas diferentes", async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()

    vi.stubGlobal("fetch", fetchMock)

    render(<RegisterPage />)

    const camposSenha =
      screen.getAllByPlaceholderText(/digite sua senha/i)

    await user.type(
      screen.getByPlaceholderText(/digite seu email/i),
      "teste@email.com",
    )

    await user.type(
      camposSenha[0],
      "123456",
    )

    await user.type(
      camposSenha[1],
      "654321",
    )

    await user.click(
      screen.getByRole("button", {
        name: /cadastrar/i,
      }),
    )

    expect(
      screen.getByText(
        "As senhas digitadas não coincidem",
      ),
    ).toBeInTheDocument()

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("envia os dados e mostra a resposta do servidor", async () => {
    const user = userEvent.setup()

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,

      text: vi.fn().mockResolvedValue(
        "Cadastro válido",
      ),
    })

    vi.stubGlobal("fetch", fetchMock)

    render(<RegisterPage />)

    const camposSenha =
      screen.getAllByPlaceholderText(/digite sua senha/i)

    await user.type(
      screen.getByPlaceholderText(/digite seu email/i),
      "teste@email.com",
    )

    await user.type(
      camposSenha[0],
      "123456",
    )

    await user.type(
      camposSenha[1],
      "123456",
    )

    await user.click(
      screen.getByRole("button", {
        name: /cadastrar/i,
      }),
    )

    expect(
      await screen.findByText("Cadastro válido"),
    ).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: "teste@email.com",
          senha: "123456",
        }),
      },
    )
  })
})