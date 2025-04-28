"use client"

import { useAuth } from "../services/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import NavBar from "../components/NavBar"
import { Bar, Line, Scatter } from "react-chartjs-2"
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
} from "chart.js"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
)

const turtleData = [
  {
    id: 1,
    image: "https://placehold.co/100x100?text=Turtle",
    dateRescued: "2025-04-25",
    length: 30,
    weight: 5,
    notes: "Released back into the wild.",
  },
  {
    id: 2,
    image: "https://placehold.co/100x100?text=Turtle2",
    dateRescued: "2025-04-20",
    length: 28,
    weight: 4.5,
    notes: "Minor shell injury.",
  },
  {
    id: 3,
    image: "https://placehold.co/100x100?text=Turtle3",
    dateRescued: "2025-04-18",
    length: 32,
    weight: 6,
    notes: "In recovery.",
  },
]

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user === null) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-700 dark:text-white">Loading...</p>
      </div>
    )
  }

  if (!user) return null

  // Rescue Trends Data: Count how many turtles were rescued each day
  const rescueTrends = turtleData.reduce(
    (acc: Record<string, number>, turtle) => {
      const date = turtle.dateRescued
      acc[date] = acc[date] ? acc[date] + 1 : 1
      return acc
    },
    {}
  )

  // Data for Line chart (Rescue Trends)
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

  // Data for Scatter chart (Turtle Length vs Weight)
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Hello, {user.email}!
        </h2>

        {/* Turtle Rescue Trends and Turtle Length vs Weight Charts */}
        <div className="mb-8 flex gap-8 justify-center">
          <div className="w-full max-w-md">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Turtle Rescue Trends Over Time
            </h3>
            <Line data={trendChartData} height={300} />
          </div>

          <div className="w-full max-w-md">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Turtle Length vs Weight
            </h3>
            <Scatter data={scatterChartData} height={300} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-left">Date Rescued</th>
                <th className="py-3 px-6 text-left">Length</th>
                <th className="py-3 px-6 text-left">Weight</th>
                <th className="py-3 px-6 text-left">Notes</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300 text-sm font-light">
              {turtleData.map((turtle) => (
                <tr
                  key={turtle.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
                >
                  <td className="py-3 px-6">
                    <img
                      src={turtle.image}
                      alt="Turtle"
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  </td>
                  <td className="py-3 px-6">{turtle.dateRescued}</td>
                  <td className="py-3 px-6">{turtle.length} cm</td>
                  <td className="py-3 px-6">{turtle.weight} kg</td>
                  <td className="py-3 px-6">{turtle.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
