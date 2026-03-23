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

export default function LoginPage() {
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
            <div className = "flex w-full items-center gap-2 border rounded-md px-4">
              <i className = "bx bxs-user"></i>
              <Input placeholder="Digite seu email" 
              className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent"
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-0.5">
            <p>Senha</p>
            <div className="flex w-full items-center gap-2 border rounded-md px-4">
              <i className = "bx bxs-lock-alt"></i>
              <Input placeholder="Digite seu fernando" type = "password" 
              className="flex-1 border-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="remeber flex items-center justify-between">
            <label>
              <input type = "checkbox" className="mr-2"/>
              Remember-me
            </label>   
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot my password
            </a>         
          </div>
          <Button className="max-w-16" variant="default">
            Entrar
          </Button>
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
