"use client"

import { useState, useEffect } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { useRouter } from "next/navigation"
import NavBar from "./components/NavBar"
import Link from "next/link"

export default function ScanQR() {
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null)
  const router = useRouter()

  useEffect(() => {
    const qrRegionId = "qr-reader"
    const existingScannerElement = document.getElementById(qrRegionId)

    if (scanner) {
      scanner.clear().catch((error) => console.error("Clear error:", error))
    }

    const newScanner = new Html5QrcodeScanner(
      qrRegionId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    )

    newScanner.render(
      (result) => {
        console.log("Scanned QR Code:", result)
        newScanner.clear() // Stop scanner after successful scan

        // Redirect to turtle view page with scanned ID
        router.push(`/admin/turtle/${result}`)
      },
      (error) => {
        console.warn("QR Scan Error:", error)
      }
    )

    setScanner(newScanner)

    return () => {
      if (existingScannerElement) {
        existingScannerElement.innerHTML = ""
      }
      newScanner.clear().catch((error) => console.error("Clear error:", error))
    }
  }, [])

  return (
    <div>
      <NavBar />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-100 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Scan a Turtle QR Code
        </h1>

        <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex justify-center items-center mb-6">
          <div id="qr-reader" className="w-full" />
        </div>

        <div className="w-full flex justify-center mt-6">
          <Link
            href="/add-turtle"
            className="bg-[#121821] text-white font-semibold text-lg py-3 px-6 rounded-lg shadow-md hover:bg-[#324158] transition duration-300 transform hover:scale-105"
          >
            Add Turtle
          </Link>
        </div>
      </div>
    </div>
  )
}
