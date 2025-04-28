"use client"
import React from "react"
import Link from "next/link"

function NavBar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link href="/" className="title">
          trackEm
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
