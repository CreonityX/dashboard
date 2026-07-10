import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Geist_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ variable: '--font-space-grotesk', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Creonity',
  description: 'Creator brand management platform',
  generator: 'creonity.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

import { ThemeProvider } from "@/components/theme-provider"
import { CommandPalette } from "@/components/command-palette"
import { Toaster } from "sonner"
import { SupportChatProvider } from "@/components/support/support-chat-provider"
import { SupportChatToast } from "@/components/support/support-chat-toast"
import { MessageToastProvider } from "@/components/messages/message-toast"
import { ProfileProvider } from "@/context/profile-context"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SupportChatProvider>
            <Toaster 
              position="top-right"
              toastOptions={{
                classNames: {
                  toast: "group flex gap-3 w-full bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#efefef] dark:border-[#27272a] shadow-xl rounded-[20px] p-4",
                  title: "text-[14px] font-semibold text-[#0a0a0a] dark:text-white leading-tight",
                  description: "text-[13px] text-[#737373] dark:text-[#a1a1aa]",
                  icon: "mt-0.5 group-data-[type=success]:text-emerald-500 group-data-[type=error]:text-rose-500 group-data-[type=warning]:text-amber-500 group-data-[type=info]:text-blue-500",
                }
              }}
            />
            <MessageToastProvider />
            <SupportChatToast />
            <ProfileProvider>
              {children}
            </ProfileProvider>
            <CommandPalette />
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </SupportChatProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
