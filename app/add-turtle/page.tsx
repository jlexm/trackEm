"use client"

import React, { useState } from "react"
import NavBar from "../components/NavBar"

export default function AddTurtle() {
  const [formData, setFormData] = useState({
    image: null as File | null,
    dateRescued: "",
    length: "",
    weight: "",
    notes: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted Data:", formData)
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg space-y-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Add New Turtle
          </h1>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Turtle Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Date Rescued
            </label>
            <input
              type="date"
              name="dateRescued"
              value={formData.dateRescued}
              onChange={handleChange}
              className="block w-full text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-md p-2"
              required
            />
          </div>

          {/* Length */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Length (cm)
            </label>
            <input
              type="number"
              name="length"
              value={formData.length}
              onChange={handleChange}
              className="block w-full text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-md p-2"
              placeholder="Enter length in centimeters"
              required
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="block w-full text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-md p-2"
              placeholder="Enter weight in kilograms"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="block w-full text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-md p-2"
              rows={4}
              placeholder="Add any important notes..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#121821] hover:bg-[#324158] text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Save Turtle
          </button>
        </form>
      </div>
    </div>
  )
}
