"use client"

import * as React from "react"
import { Moon, Sun } from "@gravity-ui/icons"
import { useTheme } from "next-themes"
import { Button } from "@heroui/react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="light"
        className="h-10 w-10 text-[#737373] dark:text-[#a1a1aa]"
      >
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      isIconOnly
      variant="light"
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-10 w-10 text-[#737373] hover:bg-[#f4f4f5] dark:text-[#a1a1aa] dark:hover:bg-[#1f1f1f]"
    >
      <Sun className="h-[22px] w-[22px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[22px] w-[22px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
