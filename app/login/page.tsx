import { Button } from "@/components/ui/button"
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
            <Input placeholder="Digite seu email" />
          </div>
          <div className="flex w-full flex-col gap-0.5">
            <p>Senha</p>
            <Input placeholder="Digite sua senha" />
          </div>
          <Button className="max-w-16" variant="default">
            Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
