"use client"

import { useAuth } from "../services/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import { db } from "@/firebase/clientApp"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Bar, Line, Scatter, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js"
import { Eye, Trash2 } from "lucide-react"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
)

export default function AdminPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const [turtleData, setTurtleData] = useState<any[]>([])

  useEffect(() => {
    if (!loading && user === null) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchTurtles = async () => {
      const turtlesRef = collection(db, "turtles")
      const querySnapshot = await getDocs(turtlesRef)
      const turtles: any[] = []
      querySnapshot.forEach((doc) => {
        turtles.push({ id: doc.id, ...doc.data() })
      })
      setTurtleData(turtles)
    }

    fetchTurtles()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f0fdf4]">
        <p className="text-[#6b7280]">Loading...</p>
      </div>
    )
  }

  if (!user) return null

  const rescueTrends = turtleData.reduce(
    (acc: Record<string, number>, turtle) => {
      const date = turtle.dateRescued.toDate().toLocaleDateString()
      acc[date] = acc[date] ? acc[date] + 1 : 1
      return acc
    },
    {}
  )

  const trendChartData = {
    labels: Object.keys(rescueTrends),
    datasets: [
      {
        label: "Turtles Rescued Over Time",
        data: Object.values(rescueTrends),
        fill: false,
        borderColor: "#059669", // Emerald primary color
        tension: 0.1,
      },
    ],
  }

  const scatterChartData = {
    datasets: [
      {
        label: "Turtle Length vs Weight",
        data: turtleData.map((turtle) => ({
          x: turtle.length,
          y: turtle.weight,
        })),
        backgroundColor: "#10b981", // Light emerald color
      },
    ],
  }

  const turtleCountPieData = {
    labels: Object.keys(rescueTrends),
    datasets: [
      {
        label: "Turtle Count Distribution",
        data: Object.values(rescueTrends),
        backgroundColor: [
          "#10b981",
          "#059669",
          "#6b7280",
          "#34d399",
          "#34a853", // Matching landing page colors
        ],
      },
    ],
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this turtle?"
    )
    if (!confirmDelete) return

    try {
      await deleteDoc(doc(db, "turtles", id))
      setTurtleData((prev) => prev.filter((turtle) => turtle.id !== id))
    } catch (error) {
      console.error("Error deleting turtle:", error)
      alert("Failed to delete turtle. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      <NavBar />
      <main className="p-4 sm:p-8 space-y-10 max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#064e3b]">
            Hello, {user.email}!
          </h2>
          <button
            onClick={handleLogout}
            className="bg-[#059669] text-white py-2 px-4 sm:px-6 rounded-md hover:bg-[#047857] transition duration-200 text-sm sm:text-base"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="w-full bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-[#064e3b] mb-4">
              Turtle Rescue Trends
            </h3>
            <Line data={trendChartData} height={250} />
          </div>

          <div className="w-full bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-[#064e3b] mb-4">
              Turtle Length vs Weight
            </h3>
            <Scatter data={scatterChartData} height={250} />
          </div>

          <div className="w-full bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-[#064e3b] mb-4">
              Rescue Count Distribution
            </h3>
            <Pie data={turtleCountPieData} height={250} />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm sm:text-base">
            <thead className="bg-[#d1fae5] text-[#064e3b]">
              <tr>
                <th className="py-3 px-4 sm:px-6 text-left">Image</th>
                <th className="py-3 px-4 sm:px-6 text-left">Date Rescued</th>
                <th className="py-3 px-4 sm:px-6 text-left">Length</th>
                <th className="py-3 px-4 sm:px-6 text-left">Weight</th>
                <th className="py-3 px-4 sm:px-6 text-left">Location</th>
                <th className="py-3 px-4 sm:px-6 text-left">Notes</th>
                <th className="py-3 px-4 sm:px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[#6b7280]">
              {turtleData.map((turtle) => (
                <tr
                  key={turtle.id}
                  className="border-b border-gray-200 hover:bg-[#f0fdf4] transition duration-300"
                >
                  <td className="py-3 px-4 sm:px-6">
                    <img
                      src={
                        turtle.imageUrl ||
                        "https://placehold.co/100x100?text=Turtle"
                      }
                      alt="Turtle"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-3 px-4 sm:px-6">
                    {turtle.dateRescued.toDate().toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 sm:px-6">{turtle.length} cm</td>
                  <td className="py-3 px-4 sm:px-6">{turtle.weight} kg</td>
                  <td className="py-3 px-4 sm:px-6">
                    {turtle.location || "—"}
                  </td>
                  <td className="py-3 px-4 sm:px-6">{turtle.notes}</td>
                  <td className="py-3 px-4 sm:px-6 whitespace-nowrap flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/turtle/${turtle.id}`)}
                      className="text-[#059669] hover:text-[#047857]"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(turtle.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
