# Lab-prog

[Descreva em 1 ou 2 frases o que o sistema faz e para quem é.]

## Tecnologias

- **[Next.js 16](https://nextjs.org/)** (App Router, Turbopack) e **React 19**
- **TypeScript**
- **[Prisma 7](https://www.prisma.io/)** com **PostgreSQL** (`@prisma/adapter-pg`)
- **Tailwind CSS 4**, **shadcn/ui**, **Radix UI**
- **FullCalendar** (visualização de calendário/agenda)
- **Autenticação:** `bcrypt` (hash de senhas), `jose` / `jsonwebtoken` (JWT) e `middleware.ts` para proteção de rotas
- **ESLint** e **Prettier**

## Funcionalidades

- [ ] [Autenticação de usuários (login/cadastro)]
- [ ] [Calendário de eventos/agendamentos]
- [ ] [Liste as demais funcionalidades]

## Estrutura do projeto

```
.
├── app/            # Rotas e páginas (Next.js App Router)
├── components/     # Componentes de interface reutilizáveis
├── hooks/          # Hooks customizados
├── lib/            # Utilitários e configurações (ex.: cliente Prisma)
├── prisma/         # Schema e migrações do banco de dados
├── public/         # Arquivos estáticos
├── middleware.ts   # Middleware de proteção de rotas
└── prisma.config.ts
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior
- npm
- Um banco de dados PostgreSQL (local ou na nuvem)

## Como executar

1. **Clone o repositório**

   ```bash
   git clone https://github.com/GGomesz/Lab-prog.git
   cd Lab-prog
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env` na raiz do projeto:

   ```env
   DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO"
   JWT_SECRET="uma-chave-secreta-forte"
   ```

   > Ajuste os nomes das variáveis conforme o que o código utiliza.

4. **Prepare o banco de dados**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Inicie o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000).

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (Turbopack) |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o servidor em modo produção |
| `npm run lint` | Executa o ESLint |
| `npm run format` | Formata os arquivos `.ts`/`.tsx` com Prettier |
| `npm run typecheck` | Verifica os tipos com o TypeScript |

## Autores

- [@GGomesz](https://github.com/GGomesz)

## Licença

[Defina a licença do projeto, ex.: MIT.]
