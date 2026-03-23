import bcrypt from "bcrypt"

async function gerarHash() {
  const senha = "123456"
  const saltRounds = 10

  const hash = await bcrypt.hash(senha, saltRounds)

  console.log("Hash gerado:")
  console.log(hash)
}

gerarHash()