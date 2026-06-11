"use client"

import * as React from "react"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

type SidebarUser = {
  email?: string
}

type NavSubItem = {
  title: string
  url: string
}

type NavItem = {
  title: string
  url: string
  items: NavSubItem[]
}

const data: {
  navMain: NavItem[]
} = {
  navMain: [
    {
      title: "Calendário",
      url: "#",
      items: [
        {
          title: "Ver calendário",
          url: "/dashboard/calendario",
        },
      ],
    },
    {
      title: "Tarefa",
      url: "#",
      items: [
        {
          title: "Adicionar tarefa",
          url: "/dashboard/tarefa/adicionar",
        },
        {
          title: "Lista de tarefa",
          url: "/dashboard/tarefa/lista",
        },
      ],
    },
  ],
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: SidebarUser
}

export function AppSidebar({
  user,
  ...props
}: AppSidebarProps) {
  const router = useRouter()

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        console.error("Não foi possível encerrar a sessão")
        return
      }

      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Erro ao realizar logout:", error)
    }
  }

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              type="button"
              onClick={handleLogout}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <LogOut className="size-4" />
              </div>

              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">
                  {user?.email ?? "Usuário"}
                </span>

                <span>Sair</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((navItem) => (
              <SidebarMenuItem key={navItem.title}>
                <SidebarMenuButton asChild>
                  <a
                    href={navItem.url}
                    className="font-medium"
                  >
                    {navItem.title}
                  </a>
                </SidebarMenuButton>

                {navItem.items.length > 0 ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {navItem.items.map((subItem) => (
                      <SidebarMenuSubItem
                        key={subItem.title}
                      >
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            {subItem.title}
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}