"use client"

import { useAuth } from "../services/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import NavBar from "../components/NavBar"
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
  ArcElement, // Added ArcElement for Pie chart
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
  LineElement,
  ArcElement // Register ArcElement for Pie chart
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
  const { user, loading, logout } = useAuth()
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

  // Data for Pie chart (Turtle Count Distribution)
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
        ], // Different colors for each segment
      },
    ],
  }

  // Logout function
  const handleLogout = () => {
    logout() // Calling the logout function to log the user out
    router.push("/login") // Redirecting to login page
  }

  // Action Handlers
  const handleView = (id: number) => {
    alert(`Viewing Turtle ${id}`)
  }

  const handleEdit = (id: number) => {
    alert(`Editing Turtle ${id}`)
  }

  const handleDelete = (id: number) => {
    alert(`Deleting Turtle ${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="p-6 space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Hello, {user.email}!
          </h2>
          <button
            onClick={handleLogout}
            className="bg-[#FF2C2C] text-white px-4 py-2 rounded-full hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Turtle Rescue Trends Over Time
            </h3>
            <Line data={trendChartData} height={250} />
          </div>

          <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Turtle Length vs Weight
            </h3>
            <Scatter data={scatterChartData} height={250} />
          </div>

          {/* Turtle Count Pie Chart */}
          <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Turtle Rescue Count Distribution
            </h3>
            <Pie data={turtleCountPieData} height={250} />
          </div>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <table className="min-w-full table-auto text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase">
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-left">Date Rescued</th>
                <th className="py-3 px-6 text-left">Length</th>
                <th className="py-3 px-6 text-left">Weight</th>
                <th className="py-3 px-6 text-left">Notes</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300 font-light">
              {turtleData.map((turtle) => (
                <tr
                  key={turtle.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
                >
                  <td className="py-3 px-6">
                    <img
                      src={turtle.image}
                      alt="Turtle"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover"
                    />
                  </td>
                  <td className="py-3 px-6">{turtle.dateRescued}</td>
                  <td className="py-3 px-6">{turtle.length} cm</td>
                  <td className="py-3 px-6">{turtle.weight} kg</td>
                  <td className="py-3 px-6">{turtle.notes}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleView(turtle.id)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(turtle.id)}
                      className="text-yellow-500 hover:text-yellow-700 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(turtle.id)}
                      className="text-red-500 hover:text-red-700"
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
