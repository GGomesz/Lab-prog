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
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mensagem, setMensagem] = useState("")

  async function handleLogin() {
    setMensagem("")

    if (!email.includes("@")) {
      setMensagem("Email inválido")
      return
    }

    if (!senha) {
      setMensagem("Digite sua senha")
      return
    }

    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      })

      // ✅ SE LOGIN DER CERTO
      if (resposta.ok) {
        window.location.href = "/dashboard/home" // ou "/dashboard/home"
        return
      }

      // ❌ SE DER ERRO
      const texto = await resposta.text()
      setMensagem(texto)
    } catch (erro) {
      console.error("Erro no login:", erro)
      setMensagem("Erro ao conectar com o servidor")
    }
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Card className="w-[550px]">
        <CardHeader>
          <CardTitle>Entrar na conta</CardTitle>
          <CardDescription>
            Siga os passos para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex w-full flex-col gap-0.5">
            <p>Email</p>
            <div className="flex w-full items-center gap-2 rounded-md border pl-4">
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
            <div className="flex w-full items-center gap-2 rounded-md border pl-4">
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
          <div className="remeber flex items-center justify-between">
            <label>
              <input type="checkbox" className="mr-2" />
              Remember-me
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot my password
            </a>
          </div>
          <Button className="max-w-16" variant="default" onClick={handleLogin}>
            Entrar
          </Button>
          {mensagem && <p className="text-sm">{mensagem}</p>}
          <div className="register text-center text-sm">
            Não tem conta?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Registrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
