import bcrypt from "bcrypt"




export async function POST(request: Request){
    const data = await request.json()

    const email = data.email
    const senha = data.senha

    const hashSalvo = "$2b$10$cURoTykGD3EI1Wnp8jLXl.GeTXlLswTT5CjKrTib3jb3GW/8PqFKu"

    const senhaValida = await bcrypt.compare(senha, hashSalvo)

    if(!senhaValida){
        return new Response("Login Inválido")
    }

    return new Response("Login Válido")
}