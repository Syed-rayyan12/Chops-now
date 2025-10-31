"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getRestaurantBySlug, updateRestaurantBySlug, updateRestaurantBySlugForm, deleteRestaurantBySlug, RestaurantUpdatePayload } from "@/lib/api/restaurant.api"
import { isRestaurantSetupComplete } from "@/lib/utils"

export default function RestaurantSettingsPage() {
  const router = useRouter()
  const [slug, setSlug] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [form, setForm] = useState<RestaurantUpdatePayload>({
    name: "",
    description: "",
    image: "/placeholder.svg",
    coverImage: "/placeholder.svg",
    cuisineType: "",
    priceRange: "££",
    openingHours: "9:00 AM - 10:00 PM",
    minimumOrder: 15,
    deliveryFee: 0,
    serviceFee: 2.99,
    deliveryTime: "30-45 min",
    phone: "",
    address: "",
  })

  // Danger Zone (Delete)
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError] = useState<string>("")

  useEffect(() => {
    console.log("🔍 Settings page loaded, checking localStorage...")
    const rd = typeof window !== "undefined" ? localStorage.getItem("restaurantData") : null
    console.log("📦 restaurantData from localStorage:", rd)
    
    if (!rd) {
      console.error("❌ No restaurantData found in localStorage")
      setError("No restaurant data found. Please log in again.")
      return
    }
    
    try {
      const parsed = JSON.parse(rd)
      console.log("✅ Parsed restaurantData:", parsed)
      console.log("🔑 Slug from parsed data:", parsed?.slug)
      
      if (parsed?.slug) {
        setSlug(parsed.slug)
        console.log("✅ Slug set to:", parsed.slug)
        
        console.log("🔄 Fetching restaurant data by slug...")
        getRestaurantBySlug(parsed.slug).then((r) => {
          console.log("📥 Restaurant data received:", r)
          if (!r) {
            console.error("❌ No restaurant data returned")
            return
          }
          setForm((f) => ({
            ...f,
            name: r.name ?? f.name,
            description: r.description ?? f.description,
            image: r.image ?? f.image,
            coverImage: r.coverImage ?? f.coverImage,
            cuisineType: r.cuisineType ?? f.cuisineType,
            priceRange: r.priceRange ?? f.priceRange,
            openingHours: r.openingHours ?? f.openingHours,
            minimumOrder: r.minimumOrder ?? f.minimumOrder,
            deliveryFee: r.deliveryFee ?? f.deliveryFee,
            serviceFee: r.serviceFee ?? f.serviceFee,
            deliveryTime: r.deliveryTime ?? f.deliveryTime,
            phone: r.phone ?? f.phone,
            address: r.address ?? f.address,
          }))
          console.log("✅ Form populated successfully")
        }).catch(err => {
          console.error("❌ Error fetching restaurant:", err)
          setError("Failed to load restaurant data: " + err.message)
        })
      } else {
        console.error("❌ No slug in parsed data")
        setError("Restaurant slug missing. Please log in again.")
      }
    } catch (err) {
      console.error("❌ Error parsing restaurantData:", err)
      setError("Invalid restaurant data. Please log in again.")
    }
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const numeric = ["minimumOrder", "deliveryFee", "serviceFee"]
    setForm((prev) => ({
      ...prev,
      [name]: numeric.includes(name) ? Number(value) : value,
    }))
  }

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("🚀 Save Changes clicked!")
    console.log("🔑 Current slug:", slug)
    console.log("📦 Form data:", form)
    console.log("🎫 Token in localStorage:", localStorage.getItem("token") ? "Present" : "Missing")
    
    if (!slug) {
      console.error("❌ Cannot save: slug is empty!")
      setError("No restaurant found. Please log in again.")
      return
    }
    
    setSaving(true)
    setError("")
    setSuccess("")
    
    try {
      console.log("📤 Preparing form data for upload...")

      // If files are selected, send multipart/form-data
      if (imageFile || coverImageFile) {
        const formData = new FormData()
        // append text fields
        Object.entries(form).forEach(([k, v]) => {
          if (v !== undefined && v !== null) formData.append(k, String(v))
        })
        if (imageFile) formData.append("image", imageFile)
        if (coverImageFile) formData.append("coverImage", coverImageFile)

        const updated = await updateRestaurantBySlugForm(slug, formData)
        console.log("✅ Upload + update successful! Response:", updated)
        setSuccess("Restaurant settings and images saved successfully!")

        if (updated) {
          const currentData = localStorage.getItem("restaurantData")
          if (currentData) {
            const parsed = JSON.parse(currentData)
            localStorage.setItem("restaurantData", JSON.stringify({ ...parsed, ...updated }))
          }
          
          // Trigger event to notify layout to re-check setup status
          window.dispatchEvent(new Event("restaurant-setup-updated"))
          
          // If setup becomes complete, redirect to dashboard overview
          if (isRestaurantSetupComplete(updated)) {
            console.log("🎉 Setup now complete! Redirecting to dashboard...")
            setTimeout(() => router.push("/restaurant-dashboard"), 1000)
          }
        }
      } else {
        // fallback to existing JSON-based update
        const updated = await updateRestaurantBySlug(slug, form)
        console.log("✅ Update successful! Response:", updated)
        setSuccess("Restaurant settings saved successfully!")
        if (updated) {
          const currentData = localStorage.getItem("restaurantData")
          if (currentData) {
            const parsed = JSON.parse(currentData)
            localStorage.setItem("restaurantData", JSON.stringify({ ...parsed, ...updated }))
          }
          
          // Trigger event to notify layout to re-check setup status
          window.dispatchEvent(new Event("restaurant-setup-updated"))
          
          if (isRestaurantSetupComplete(updated)) {
            console.log("🎉 Setup now complete! Redirecting to dashboard...")
            setTimeout(() => router.push("/restaurant-dashboard"), 1000)
          }
        }
      }
    } catch (err: any) {
      console.error("❌ Update error:", err)
      setError(err.message || "Failed to save settings. Please try again.")
    } finally {
      setSaving(false)
      console.log("🏁 Save operation completed")
    }
  }

  const onDelete = async () => {
    try {
      setDeleteError("")
      if (!deleteConfirm) {
        setDeleteConfirm(true)
        return
      }
      if (!slug) {
        setDeleteError("No restaurant found. Please log in again.")
        return
      }
      setDeleting(true)
      await deleteRestaurantBySlug(slug)
      // Clear session and redirect
      localStorage.removeItem("token")
      localStorage.removeItem("restaurantData")
      router.push("/")
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete restaurant")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Restaurant Setup</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
  <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Restaurant Name</label>
          <input className="border p-2 w-full rounded bg-white" name="name" value={form.name || ""} onChange={onChange} placeholder="e.g., The Steak House" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea className="border p-2 w-full rounded bg-white" rows={4} name="description" value={form.description || ""} onChange={onChange} placeholder="Tell customers about your restaurant..." />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Cuisine Type</label>
          <input className="border p-2 w-full rounded bg-white" name="cuisineType" value={form.cuisineType || ""} onChange={onChange} placeholder="e.g., Caribbean, Asian, Italian" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Price Range</label>
          <input className="border p-2 w-full rounded bg-white" name="priceRange" value={form.priceRange || ""} onChange={onChange} placeholder="e.g., £, ££, £££, ££££" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Opening Hours</label>
          <input className="border p-2 w-full rounded bg-white" name="openingHours" value={form.openingHours || ""} onChange={onChange} placeholder="e.g., 9:00 AM - 10:00 PM" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Delivery Time</label>
          <input className="border p-2 w-full rounded bg-white" name="deliveryTime" value={form.deliveryTime || ""} onChange={onChange} placeholder="e.g., 30-45 min" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">Minimum Order (£)</label>
            <input className="border p-2 w-full rounded bg-white" type="number" step="0.01" name="minimumOrder" value={form.minimumOrder ?? 0} onChange={onChange} placeholder="15.00" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Delivery Fee (£)</label>
            <input className="border p-2 w-full rounded bg-white" type="number" step="0.01" name="deliveryFee" value={form.deliveryFee ?? 0} onChange={onChange} placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Service Fee (£)</label>
            <input className="border p-2 w-full rounded bg-white" type="number" step="0.01" name="serviceFee" value={form.serviceFee ?? 0} onChange={onChange} placeholder="2.99" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input className="border p-2 w-full rounded bg-white" name="phone" value={form.phone || ""} onChange={onChange} placeholder="e.g., +44 1234 567890" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <input className="border p-2 w-full rounded bg-white" name="address" value={form.address || ""} onChange={onChange} placeholder="e.g., 123 Main Street, London" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Restaurant Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            className="border p-2 w-full rounded bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImageFile(e.target.files ? e.target.files[0] : null)}
            className="border p-2 w-full rounded bg-white"
          />
        </div>
        
        <button disabled={saving} className="bg-black text-white px-6 py-3 rounded w-full hover:bg-gray-800 disabled:bg-gray-400">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Danger Zone */}
      <section className="mt-10">
        <div className="border border-red-200 bg-red-50 rounded-lg p-6">
          <h3 className="text-red-700 text-lg font-semibold mb-2">Danger Zone</h3>
          <p className="text-sm text-red-700 mb-4">
            Deleting your restaurant will archive it and disable access. This action can’t be undone.
          </p>
          {deleteError && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded mb-3">{deleteError}</div>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            {deleteConfirm && (
              <span className="text-sm text-red-700">Click Delete again to confirm.</span>
            )}
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : deleteConfirm ? "Delete (Confirm)" : "Delete Restaurant"}
            </button>
            {deleteConfirm ? (
              <button
                type="button"
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="px-4 py-2 rounded-md border border-red-300 text-red-700 hover:bg-red-100"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
