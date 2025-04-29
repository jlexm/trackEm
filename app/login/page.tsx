"use client"

import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/clientApp"
import { useState } from "react"
import { useRouter } from "next/navigation"
import NavBar from "../components/NavBar"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/admin")
    } catch (error: any) {
      console.error(error.message)
      alert("Login failed: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <form
          onSubmit={login}
          className="w-full max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Admin Login
          </h2>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
              Email
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
              Password
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#121821] hover:bg-[#324158] text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? <span>Loading...</span> : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}
