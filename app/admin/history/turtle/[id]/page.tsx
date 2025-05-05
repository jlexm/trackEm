"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/clientApp"
import NavBar from "@/app/components/NavBar"
import { useParams } from "next/navigation"
import { Ruler, Weight, StickyNote, Calendar, Image, Info } from "lucide-react"

export default function TurtleHistoryPage() {
  const { id } = useParams()
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      if (!id) return
      const turtleRef = doc(db, "turtles", id as string)
      const turtleSnap = await getDoc(turtleRef)

      if (turtleSnap.exists()) {
        const data = turtleSnap.data()
        const sortedHistory = (data.history || []).sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setHistory(sortedHistory)
      }
    }

    fetchHistory()
  }, [id])

  return (
    <div>
      <NavBar />
      <div className="bg-white p-4 sm:p-6 md:p-8 max-w-3xl mx-auto mt-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#064e3b]">
          Turtle Update History
        </h1>

        {history.length > 0 ? (
          history.map((entry, index) => {
            const isLatestChange = index === 0
            return (
              <div
                key={index}
                className={`bg-gray-50 p-4 rounded-lg shadow-md mb-4 relative ${
                  isLatestChange ? "border-4 border-[#059669]" : ""
                }`}
              >
                {isLatestChange && (
                  <span className="text-xs text-[#059669] font-semibold uppercase absolute top-4 right-4 bg-white px-2 py-1 rounded-md">
                    Latest Change
                  </span>
                )}
                <p className="text-xs sm:text-sm font-medium text-[#6b7280] mb-2">
                  {new Date(entry.date).toLocaleString()}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {Object.keys(entry.changes).map((key) => {
                    const Icon = getIconForField(key)
                    const value =
                      entry.changes[key] === "Not Updated"
                        ? "No Change"
                        : entry.changes[key]
                    return (
                      <li key={key} className="flex items-center gap-2">
                        <Icon size={16} className="text-[#6b7280]" />
                        <span className="font-medium capitalize text-[#064e3b]">
                          {key}:
                        </span>
                        <span>{value}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })
        ) : (
          <p className="text-center text-sm text-[#6b7280]">
            No history available for this turtle.
          </p>
        )}
      </div>
    </div>
  )
}

function getIconForField(field: string) {
  switch (field.toLowerCase()) {
    case "length":
      return Ruler
    case "weight":
      return Weight
    case "notes":
      return StickyNote
    case "daterescued":
    case "date rescued":
      return Calendar
    case "imageurl":
    case "image":
      return Image
    default:
      return Info
  }
}
