"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/clientApp"
import { Calendar, Ruler, Weight, MapPin, StickyNote, Info } from "lucide-react"

export default function TurtleHistoryPage({ id }: { id: string }) {
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      if (!id) return
      const turtleRef = doc(db, "turtles", id)
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
      <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-800">
        Turtle Update History
      </h1>

      {history.length > 0 ? (
        history.map((entry, index) => {
          const isLatestChange = index === 0
          return (
            <div
              key={index}
              className={`relative bg-gray-50 p-4 rounded-lg shadow-md mb-4 ${
                isLatestChange ? "border-4 border-blue-500" : ""
              }`}
            >
              {isLatestChange && (
                <span className="text-xs text-blue-500 font-semibold uppercase absolute top-4 right-4 bg-white px-2 py-1 rounded-md">
                  Latest Change
                </span>
              )}
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
                {new Date(entry.date).toLocaleString()}
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                {Object.keys(entry.changes).map((key) => (
                  <li key={key} className="flex items-center gap-2">
                    {key === "dateRescued" && (
                      <Calendar size={16} className="text-blue-500" />
                    )}
                    {key === "length" && (
                      <Ruler size={16} className="text-green-500" />
                    )}
                    {key === "weight" && (
                      <Weight size={16} className="text-yellow-500" />
                    )}
                    {key === "location" && (
                      <MapPin size={16} className="text-purple-500" />
                    )}
                    {key === "notes" && (
                      <StickyNote size={16} className="text-gray-500" />
                    )}
                    {![
                      "dateRescued",
                      "length",
                      "weight",
                      "location",
                      "notes",
                    ].includes(key) && (
                      <Info size={16} className="text-gray-400" />
                    )}
                    <span className="font-medium capitalize">{key}:</span>
                    <span>
                      {entry.changes[key] === "Not Updated"
                        ? "No Change"
                        : entry.changes[key]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })
      ) : (
        <p className="text-center text-sm text-gray-500">
          No history available for this turtle.
        </p>
      )}
    </div>
  )
}
