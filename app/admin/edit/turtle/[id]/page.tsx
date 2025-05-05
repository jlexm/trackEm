"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db, storage } from "@/firebase/clientApp"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import NavBar from "@/app/components/NavBar"

export default function EditTurtlePage() {
  const { id } = useParams()
  const router = useRouter()

  const [turtle, setTurtle] = useState<any>(null)
  const [notes, setNotes] = useState("")
  const [location, setLocation] = useState("")
  const [length, setLength] = useState<number | "">("")
  const [weight, setWeight] = useState<number | "">("")
  const [image, setImage] = useState<File | null>(null)

  useEffect(() => {
    const fetchTurtle = async () => {
      if (!id) return
      const turtleRef = doc(db, "turtles", id as string)
      const turtleSnap = await getDoc(turtleRef)

      if (turtleSnap.exists()) {
        const data = turtleSnap.data()
        setTurtle(data)
        setNotes(data.notes || "")
        setLocation(data.location || "")
        setLength(data.length || "")
        setWeight(data.weight || "")
      }
    }

    fetchTurtle()
  }, [id])

  const handleImageUpload = async () => {
    if (image) {
      const imageRef = ref(storage, `turtle_images/${id}_${image.name}`)
      const uploadTask = uploadBytesResumable(imageRef, image)

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref)
            resolve(imageUrl)
          }
        )
      })
    }
    return null
  }

  const handleSave = async () => {
    if (!id) return

    const updateDate = new Date().toISOString()

    // Get image URL only if image is uploaded
    const imageUrl = image ? await handleImageUpload() : null

    const turtleRef = doc(db, "turtles", id as string)

    const updateData: any = {
      notes: notes,
      location: location,
      length: length,
      weight: weight,
      updateDate: updateDate,
      history: arrayUnion({
        date: updateDate,
        changes: {
          notes,
          location,
          length,
          weight,
          image: imageUrl ? "Updated" : "Not Updated",
        },
      }),
    }

    // Only include the image if imageUrl is not null
    if (imageUrl) {
      updateData.image = imageUrl
    } else {
      // Preserve the existing image if no new image is uploaded
      if (turtle?.image) {
        updateData.image = turtle.image
      }
    }

    try {
      // Update the document with the constructed update data
      await updateDoc(turtleRef, updateData)
      alert("Turtle updated!")
      router.push("/admin")
    } catch (error) {
      console.error("Error updating turtle:", error)
      alert("Failed to update turtle.")
    }
  }

  if (!turtle) {
    return (
      <div className="p-6 text-center">
        <p>Loading turtle data...</p>
      </div>
    )
  }

  return (
    <div>
      <NavBar />
      <div className="bg-white p-6 sm:p-8 max-w-xl mx-auto rounded-lg shadow-lg mt-6">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Update Turtle
        </h1>
        <p className="text-sm text-gray-600 text-center mb-4">ID: {id}</p>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Length (cm)
            </label>
            <input
              type="number"
              value={length}
              onChange={(e) =>
                setLength(e.target.value ? parseFloat(e.target.value) : "")
              }
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) =>
                setWeight(e.target.value ? parseFloat(e.target.value) : "")
              }
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload New Image (Optional)
            </label>
            <input
              type="file"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
