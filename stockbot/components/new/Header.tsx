'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User } from 'lucide-react'

const Header = () => (
  <header className="flex items-center justify-between px-4 py-2 bg-background border-b">
    <div className="flex items-center justify-between max-w-6xl w-full mx-auto px-12">
      <Link href="/trade" className="text-sm font-light hover:text-primary">trade</Link>
      <Link href="/learn" className="text-sm font-light hover:text-primary">learn</Link>
      <div className="flex-shrink-0">
        <Image src="/logo.png" alt="Logo" width={120} height={46} />
      </div>
      <Link href="/hire" className="text-sm font-light hover:text-primary">hire</Link>
      <Link href="/about" className="text-sm font-light hover:text-primary">about</Link>
    </div>
    <Link href="/profile" className="text-sm hover:text-primary ml-4">
      <User className="h-5 w-5" />
      <span className="sr-only">Profile</span>
    </Link>
  </header>
)

export default Header