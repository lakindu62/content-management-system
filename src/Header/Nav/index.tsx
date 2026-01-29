'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="hidden md:flex gap-3 z-50 items-center px-10 py-4 bg-white/10 rounded-[64px] outline outline-1 outline-offset-[-1px] outline-neutral-500 backdrop-blur-lg justify-center overflow-hidden">
      {navItems.map(({ link }, i) => {
        return (
          <div className="font-semibold" key={i}>
            <CMSLink {...link} appearance="link" />{' '}
            <span className="ml-[6px] text-white"> /</span>{' '}
          </div>
        )
      })}
    </nav>
  )
}
