import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Inter_Tight } from 'next/font/google'
import { redirect } from 'next/navigation'
import React from 'react'

// import { AdminBar } from '@/components/AdminBar'
// import { Footer } from '@/Footer/Component'
// import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
// import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
// import { draftMode } from 'next/headers'

import './globals.css'
// import { getServerSideURL } from '@/utilities/getURL'

// Load Inter Tight font with all weights and latin subset.
const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  redirect('/admin')

  return (
    <html
      className={cn(interTight.variable, GeistSans.variable, GeistMono.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className={cn(interTight.className)}>
        <Providers>{<div></div>}</Providers>
      </body>
    </html>
  )
}
