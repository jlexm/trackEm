"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/clientApp"
import NavBar from "@/app/components/NavBar"
import { QRCodeSVG } from "qrcode.react"
import { Calendar, Ruler, Weight, StickyNote } from "lucide-react"

export default function ViewTurtle() {
  const { id } = useParams()
  const router = useRouter()
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
      <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 mt-8 px-4 py-6 max-w-7xl mx-auto">
        {/* Turtle Details */}
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={turtle.imageUrl}
              alt="Turtle"
              className="h-full w-auto object-contain"
            />
          </div>

          <div className="p-6 space-y-5">
            <h1 className="text-3xl font-semibold text-[#064e3b] text-center mb-4">
              Turtle Details
            </h1>

            <Detail label="Date Rescued">
              <Calendar
                size={16}
                className="inline-block mr-2 text-[#6b7280]"
              />
              {turtle.dateRescued.toDate().toLocaleDateString()}
            </Detail>

            <Detail label="Length">
              <Ruler size={16} className="inline-block mr-2 text-[#6b7280]" />
              {turtle.length} cm
            </Detail>

            <Detail label="Weight">
              <Weight size={16} className="inline-block mr-2 text-[#6b7280]" />
              {turtle.weight} kg
            </Detail>

            <Detail label="Notes">
              <StickyNote
                size={16}
                className="inline-block mr-2 text-[#6b7280]"
              />
              {turtle.notes || "No notes provided."}
            </Detail>

            {/* QR Code */}
            <div className="text-center pt-4 border-t border-gray-200">
              <div className="inline-block bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition">
                <QRCodeSVG value={id as string} size={128} />
              </div>
              <p className="text-lg font-semibold text-[#6b7280] mt-4">
                ID: {id}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row justify-center gap-4 mt-6">
              <button
                onClick={() => router.push(`/admin/edit/turtle/${id}`)}
                className="px-6 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition"
              >
                Update Turtle
              </button>
              <button
                onClick={() => router.push(`/admin/history/turtle/${id}`)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
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
      <span className="block text-xs text-[#6b7280] font-medium mb-1">
        {label}
      </span>
      <p className="text-[#064e3b] font-medium">{children}</p>
    </div>
  )
}
