"use client"
import React from "react"
import Link from "next/link"
import Image from "next/image"

function NavBar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link
          href="/"
          className="title"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <Image
            src="/trackle_logo_dark.png"
            alt="trackEm Logo"
            width={40}
            height={40}
          />
          <span style={{ marginLeft: "8px", color: "inherit" }}>trackEm</span>
        </Link>
      </div>

      <ul className="nav-links">
        <li className="nav-item">
          <Link href="/"> Home </Link>
        </li>
        <li className="nav-item">
          <Link href="/admin"> Admin </Link>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
