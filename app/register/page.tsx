"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [csenha, setcSenha] = useState("")
  const [mensagem, setMensagem] = useState("")

  async function handleRegister() {
    setMensagem("")

    if (!email.includes("@")) {
      setMensagem("Email inválido")
      return
    }

    if (!senha) {
      setMensagem("Digite sua senha")
      return
    }

    if (csenha != senha) {
      setMensagem("As senhas digitadas não coincidem")
      return
    }

    try {
      const resposta = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      })

      const texto = await resposta.text()
      setMensagem(texto)
    } catch (erro) {
      console.error("Erro no registro:", erro)
      setMensagem("Erro ao conectar com o servidor")
    }
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Card className="flex h-[400px] w-[550px]">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>Siga os passos para criar sua conta</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex w-full flex-col gap-0.5">
            <p>Email</p>
            <div className="flex w-full items-center gap-2 rounded-md border px-4">
              <i className="bx bxs-user"></i>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-0.5">
            <p>Senha</p>
            <div className="flex w-full items-center gap-2 rounded-md border px-4">
              <i className="bx bxs-lock-alt"></i>
              <Input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="flex-1 border-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-0.5">
            <p>Confirme sua senha</p>
            <div className="flex w-full items-center gap-2 rounded-md border px-4">
              <i className="bx bxs-lock-alt"></i>
              <Input
                type="password"
                required
                value={csenha}
                onChange={(e) => setcSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="flex-1 border-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          <Button
            className="max-w-20"
            variant="default"
            onClick={handleRegister}
          >
            Cadastrar
          </Button>
          {mensagem && <p className="text-sm">{mensagem}</p>}
          <div className="register text-center text-sm">
            Ja possui uma conta?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
