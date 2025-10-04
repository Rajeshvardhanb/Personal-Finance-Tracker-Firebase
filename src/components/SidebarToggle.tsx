"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/hooks/use-sidebar-provider"

export function SidebarToggle() {
  const { state, toggleSidebar, isMobile } = useSidebar()

  if (isMobile) {
    return null
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        "absolute -right-10 top-1/2 -translate-y-1/2 rounded-full size-10 flex items-center justify-center p-0",
        "bg-background/80 text-foreground border shadow-sm backdrop-blur-sm transition-all duration-300 ease-in-out",
        "hover:bg-accent hover:text-accent-foreground"
      )}
      onClick={() => toggleSidebar()}
    >
      <ChevronLeft
        className={cn(
          "size-5 transition-transform duration-300 ease-in-out",
          state === "expanded" ? "rotate-0" : "rotate-180"
        )}
      />
    </Button>
  )
}
