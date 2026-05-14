import { Geist, Geist_Mono, Raleway } from "next/font/google"

import "app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  let user = null

  if (token) {
    try {
      user = jwt.verify(token, "segredo") as any
    } catch {
      user = null
    }
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        raleway.variable
      )}
    >
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <SidebarProvider>
            <AppSidebar user={user} />
            <main className="flex-1">{children}</main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
