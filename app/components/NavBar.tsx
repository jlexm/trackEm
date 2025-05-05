"use client"
import React from "react"
import Link from "next/link"
import Image from "next/image"

function NavBar() {
  return (
    <nav className="bg-white shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-gray-800 text-xl font-semibold"
        >
          <Image
            src="/trackle_logo.png"
            alt="trackEm Logo"
            width={30}
            height={30}
            className="object-contain"
          />
          <span className="ml-2">trackEm</span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li>
            <Link
              href="/"
              className="text-gray-800 hover:text-green-600 transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              className="text-gray-800 hover:text-green-600 transition-colors"
            >
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
