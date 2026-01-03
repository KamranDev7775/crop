"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const menuItems = [
    { href: "/", label: "INTRO" },
    { href: "/home", label: "HOME" },
    { href: "/soil-analysis", label: "SOIL ANALYSIS" },
    { href: "/schedule", label: "SCHEDULE" },
    { href: "/community", label: "COMMUNITY" },
    { href: "/weather", label: "WEATHER" },
    { href: "/about", label: "ABOUT" }
  ]

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-20 left-0 right-0 bg-gray-100 border-t border-gray-200 shadow-lg z-40">
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-green-600 font-bold hover:bg-gray-200 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}