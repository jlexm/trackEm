"use client"

import Link from "next/link"
import {
  Leaf,
  ShieldCheck,
  History,
  ScanBarcode,
  Github,
  GitBranch,
} from "lucide-react"
import NavBar from "@/app/components/NavBar"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-800">
      <NavBar />

      {/* Hero Section */}
      <section className="px-6 py-20 text-center bg-gradient-to-br from-green-300 to-green-100 rounded-b-3xl shadow-md">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-green-700 via-emerald-600 to-lime-500 text-transparent bg-clip-text">
          Turtle Rescue Tracker
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-6">
          Helping conservationists rescue, track, and care for sea turtles
          efficiently with real-time data and history logging.
        </p>
        <Link
          href="/scan"
          className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-500 to-lime-500 text-white rounded-lg hover:opacity-90 transition"
        >
          Start Scanning
        </Link>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <Feature
          icon={
            <ScanBarcode size={32} className="mx-auto mb-2 text-lime-600" />
          }
          title="QR Code Scanning"
          desc="Scan QR codes to instantly access turtle rescue details."
        />
        <Feature
          icon={<Leaf size={32} className="mx-auto mb-2 text-emerald-600" />}
          title="Eco-Friendly Tracking"
          desc="Monitor rescued turtles' growth and condition with minimal impact."
        />
        <Feature
          icon={<History size={32} className="mx-auto mb-2 text-green-600" />}
          title="Update History"
          desc="Every change is logged, giving you full transparency over time."
        />
        <Feature
          icon={
            <ShieldCheck size={32} className="mx-auto mb-2 text-teal-600" />
          }
          title="Data Integrity"
          desc="Powered by Firebase for secure and reliable storage."
        />
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-tr from-white via-green-100 to-white py-16 text-center rounded-t-3xl shadow-inner">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
          {/* Avatar Placeholder */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-lime-400 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
            A
          </div>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-lime-500 text-transparent bg-clip-text mb-2">
            Developed by
          </h2>
          <p className="text-gray-700 font-medium mb-4">
            Vibe Coder - Alex Maravilla
          </p>

          <Link
            href="https://github.com/jlexm"
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg hover:opacity-90 transition"
          >
            <GitBranch size={18} />
            My GitHub
          </Link>
        </div>
      </section>
    </div>
  )
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow hover:shadow-lg transition">
      {icon}
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  )
}
