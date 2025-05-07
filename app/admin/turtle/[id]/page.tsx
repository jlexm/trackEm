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
      <div className="max-w-7xl mx-auto mt-8 px-6 py-8 bg-white rounded-lg shadow-lg">
        {/* Turtle Details */}
        <div className="lg:flex lg:space-x-8 space-y-8 lg:space-y-0">
          {/* Image and Turtle Info */}
          <div className="lg:w-1/3 flex justify-center bg-gray-100 rounded-lg shadow-md">
            <img
              src={turtle.imageUrl}
              alt="Turtle"
              className="h-full object-contain p-4 rounded-lg"
            />
          </div>

          {/* Turtle Information */}
          <div className="lg:w-2/3">
            <h1 className="text-4xl font-bold text-[#064e3b] text-center mb-6">
              Turtle Details
            </h1>

            {/* Detail Fields */}
            <div className="space-y-6">
              <Detail label="Date Rescued">
                <Calendar
                  size={24}
                  className="inline-block mr-4 text-[#6b7280]"
                />
                <span className="text-2xl text-[#064e3b]">
                  {turtle.dateRescued.toDate().toLocaleDateString()}
                </span>
              </Detail>

              <Detail label="Length">
                <Ruler size={24} className="inline-block mr-4 text-[#6b7280]" />
                <span className="text-2xl text-[#064e3b]">
                  {turtle.length} cm
                </span>
              </Detail>

              <Detail label="Weight">
                <Weight
                  size={24}
                  className="inline-block mr-4 text-[#6b7280]"
                />
                <span className="text-2xl text-[#064e3b]">
                  {turtle.weight} kg
                </span>
              </Detail>

              <Detail label="Notes">
                <StickyNote
                  size={24}
                  className="inline-block mr-4 text-[#6b7280]"
                />
                <span className="text-2xl text-[#064e3b]">
                  {turtle.notes || "No notes provided."}
                </span>
              </Detail>

              <Detail label="Turtle Type">
                <span className="inline-block mr-4 text-[#6b7280] font-medium text-2xl">
                  🐢
                </span>
                <span className="text-2xl text-[#064e3b]">
                  {turtle.turtleType || "Unknown"}
                </span>
              </Detail>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center pt-8 border-t-2 border-gray-200">
              <div className="inline-block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
                <QRCodeSVG value={id as string} size={160} />
              </div>
              <p className="text-xl font-semibold text-[#6b7280] mt-4">
                Turtle ID: {id}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row justify-center gap-8 mt-8">
              <button
                onClick={() => router.push(`/admin/edit/turtle/${id}`)}
                className="px-8 py-4 text-xl bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition"
              >
                Update Turtle
              </button>
              <button
                onClick={() => router.push(`/admin/history/turtle/${id}`)}
                className="px-8 py-4 text-xl bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
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
    <div className="text-xl flex items-center gap-4">
      <span className="text-lg text-[#6b7280] font-medium">{label}</span>
      <p className="text-[#064e3b] font-semibold">{children}</p>
    </div>
  )
}
