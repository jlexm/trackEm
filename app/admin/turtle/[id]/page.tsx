"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/clientApp"
import NavBar from "@/app/components/NavBar"
import { QRCodeSVG } from "qrcode.react"

export default function ViewTurtle() {
  const { id } = useParams()
  const [turtle, setTurtle] = useState<any>(null)

  useEffect(() => {
    const fetchTurtle = async () => {
      const docRef = doc(db, "turtles", id as string)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) setTurtle(docSnap.data())
    }
    if (id) fetchTurtle()
  }, [id])

  if (!turtle) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500 text-sm">Loading turtle data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-md w-full mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={turtle.imageUrl}
              alt="Turtle"
              className="h-full w-auto object-contain"
            />
          </div>

          <div className="p-6 space-y-5">
            <h1 className="text-2xl font-semibold text-gray-800 text-center">
              Turtle Details
            </h1>

            <Detail label="Date Rescued">
              {turtle.dateRescued.toDate().toLocaleDateString()}
            </Detail>
            <Detail label="Length">{turtle.length} cm</Detail>
            <Detail label="Weight">{turtle.weight} kg</Detail>
            <Detail label="Notes">
              {turtle.notes || "No notes provided."}
            </Detail>

            <div className="text-center pt-4 border-t border-gray-200">
              <div className="inline-block bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition">
                <QRCodeSVG value={id as string} size={128} />
              </div>
              <p className="text-lg font-semibold text-gray-700 mt-4">
                ID: {id}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Detail({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="text-sm">
      <span className="block text-xs text-gray-400 font-medium mb-1">
        {label}
      </span>
      <p className="text-gray-700 font-medium">{children}</p>
    </div>
  )
}
