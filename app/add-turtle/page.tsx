"use client"

import React, { useState } from "react"
import NavBar from "../components/NavBar"
import { storage, db } from "@/firebase/clientApp"
import { addDoc, collection, Timestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function AddTurtle() {
  const [formData, setFormData] = useState({
    image: null as File | null,
    dateRescued: "",
    length: "",
    weight: "",
    notes: "",
  })

  const [isLoading, setIsLoading] = useState(false) // Loading state

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true) // Set loading to true when submitting

    try {
      let imageUrl = ""
      if (formData.image) {
        const imageRef = ref(
          storage,
          `turtle-images/${formData.image.name}-${Date.now()}`
        )
        await uploadBytes(imageRef, formData.image)
        imageUrl = await getDownloadURL(imageRef)
      }

      await addDoc(collection(db, "turtles"), {
        imageUrl,
        dateRescued: Timestamp.fromDate(new Date(formData.dateRescued)),
        length: parseFloat(formData.length),
        weight: parseFloat(formData.weight),
        notes: formData.notes,
        createdAt: Timestamp.now(),
      })

      alert("Turtle saved successfully!")
      setFormData({
        image: null,
        dateRescued: "",
        length: "",
        weight: "",
        notes: "",
      })
    } catch (err) {
      console.error("Error saving turtle:", err)
      alert("Failed to save turtle")
    } finally {
      setIsLoading(false) // Set loading to false when finished
    }
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
              className="block w-full text-gray-900 dark:text-gray    -100 bg-gray-50 dark:bg-gray-700 rounded-md p-2"
              rows={4}
              placeholder="Add any important notes..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#121821] hover:bg-[#324158] text-white font-semibold py-2 px-4 rounded-lg transition"
            disabled={isLoading}
          >
            {isLoading ? <span>Saving...</span> : "Save Turtle"}
          </button>
        </form>
      </div>
    </div>
  )
}
