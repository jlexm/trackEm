"use client"

import { useAuth } from "../services/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import { db } from "@/firebase/clientApp"
import { collection, getDocs } from "firebase/firestore"
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
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
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
        borderColor: "rgba(75, 192, 192, 1)",
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
        backgroundColor: "rgba(75, 192, 192, 0.6)",
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
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="p-4 sm:p-8 space-y-10 max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Hello, {user.email}!
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 sm:px-6 rounded-md hover:bg-red-600 transition duration-200 text-sm sm:text-base"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="w-full bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              Turtle Rescue Trends
            </h3>
            <Line data={trendChartData} height={250} />
          </div>

          <div className="w-full bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              Turtle Length vs Weight
            </h3>
            <Scatter data={scatterChartData} height={250} />
          </div>

          <div className="w-full bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              Rescue Count Distribution
            </h3>
            <Pie data={turtleCountPieData} height={250} />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm sm:text-base">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 sm:px-6 text-left">Image</th>
                <th className="py-3 px-4 sm:px-6 text-left">Date Rescued</th>
                <th className="py-3 px-4 sm:px-6 text-left">Length</th>
                <th className="py-3 px-4 sm:px-6 text-left">Weight</th>
                <th className="py-3 px-4 sm:px-6 text-left">Notes</th>
                <th className="py-3 px-4 sm:px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {turtleData.map((turtle) => (
                <tr
                  key={turtle.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-300"
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
                  <td className="py-3 px-4 sm:px-6">{turtle.notes}</td>
                  <td className="py-3 px-4 sm:px-6 whitespace-nowrap">
                    <button
                      onClick={() => alert(`Viewing Turtle ${turtle.id}`)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => alert(`Editing Turtle ${turtle.id}`)}
                      className="text-yellow-500 hover:text-yellow-700 ml-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => alert(`Deleting Turtle ${turtle.id}`)}
                      className="text-red-500 hover:text-red-700 ml-2 text-sm"
                    >
                      Delete
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
