'use client'

import React, { useState } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Menu, X } from 'lucide-react'

export const MobileNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navItems = data?.navItems || []

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex flex-col gap-1.5 z-50 relative"
        aria-label="Toggle menu"
      >
        <span
          className={`w-6 h-0.5 transition-all duration-300 ${
            isMenuOpen ? 'rotate-45 translate-y-2 bg-primary' : 'bg-primary'
          }`}
        ></span>
        <span
          className={`w-6 h-0.5 transition-all duration-300 ${
            isMenuOpen ? 'opacity-0 bg-primary' : 'bg-primary'
          }`}
        ></span>
        <span
          className={`w-6 h-0.5 transition-all duration-300 ${
            isMenuOpen ? '-rotate-45 -translate-y-2 bg-primary' : 'bg-primary'
          }`}
        ></span>
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        {/* Sidebar */}
        <div
          className={`absolute right-0 top-0 h-full w-64 bg-background border-l border-border transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={closeMenu}
            className="absolute top-6 right-6 text-foreground hover:opacity-80 transition-opacity"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Links */}
          <nav className="flex flex-col px-6 pt-20 gap-6">
            {navItems.map(({ link }, i) => (
              <div key={i} onClick={closeMenu}>
                <CMSLink
                  {...link}
                  appearance="link"
                  className="text-xl font-semibold hover:opacity-80 transition-opacity"
                />
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
