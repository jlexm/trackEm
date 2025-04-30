"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/clientApp"
import NavBar from "@/app/components/NavBar"
import { useParams } from "next/navigation"

export default function TurtleHistoryPage() {
  const { id } = useParams() // Extract params using useParams
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      if (!id) return // Ensure id is available before making the request
      const turtleRef = doc(db, "turtles", id as string)
      const turtleSnap = await getDoc(turtleRef)

      if (turtleSnap.exists()) {
        const data = turtleSnap.data()
        // Sort history by date in descending order (latest first)
        const sortedHistory = (data.history || []).sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setHistory(sortedHistory)
      }
    }

    fetchHistory()
  }, [id]) // Run the effect when id changes

  return (
    <div>
      <NavBar />
      <div className="bg-white p-4 sm:p-6 md:p-8 max-w-3xl mx-auto mt-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-800">
          Turtle Update History
        </h1>

        {history.length > 0 ? (
          history.map((entry, index) => {
            const isLatestChange = index === 0 // Latest change is the first entry after sorting
            return (
              <div
                key={index}
                className={`bg-gray-50 p-4 rounded-lg shadow-md mb-4 ${
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
                    <li key={key} className="flex items-center">
                      <span className="font-medium capitalize mr-2">
                        {key}:
                      </span>
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
    </div>
  )
}
