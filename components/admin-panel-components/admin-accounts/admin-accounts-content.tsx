"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CreateAdminDialog } from "./create-admin-dialog"
import { EditAdminDialog } from "./edit-admin-dialog"

interface Admin {
  id: number
  firstName: string
  lastName: string
  email: string
  createdAt: string
}

export function AdminAccountsContent() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("adminToken")
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
      
      console.log("Fetching admins with token:", token ? "Present" : "Missing")
      console.log("Backend URL:", backendUrl)
      
      const response = await fetch(`${backendUrl}/api/admin/accounts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      console.log("Fetch response status:", response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch admins")
      }

      const data = await response.json()
      console.log("Admins fetched:", data)
      setAdmins(data)
    } catch (error) {
      console.error("Error fetching admins:", error)
      alert("Failed to load admin accounts. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAdmin = async (id: number) => {
    if (!confirm("Are you sure you want to delete this admin account?")) return

    try {
      setDeleteLoading(id)
      const token = localStorage.getItem("adminToken")
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
      
      const response = await fetch(`${backendUrl}/api/admin/accounts/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) throw new Error("Failed to delete admin")

      setAdmins(admins.filter((admin) => admin.id !== id))
      toast({
        title: "Success",
        description: "Admin account deleted successfully!",
        variant: "default",
      })
    } catch (error) {
      console.error("Error deleting admin:", error)
      toast({
        title: "Error",
        description: "Failed to delete admin account",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(null)
    }
  }

  const filteredAdmins = admins.filter((admin) =>
    `${admin.firstName} ${admin.lastName} ${admin.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Accounts</h1>
          <p className="text-muted-foreground mt-1">Manage admin accounts and permissions</p>
        </div>
        <Button
          onClick={() => {
            setSelectedAdmin(null)
            setShowCreateDialog(true)
          }}
          className="bg-secondary hover:bg-secondary/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Admin
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="bg-white p-4">
        <CardHeader>
          <CardTitle className="text-foreground">Search Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Admins Table */}
      <Card className="bg-white p-4">
        <CardHeader>
          <CardTitle className="text-foreground">Admin List</CardTitle>
          <CardDescription>Total Admins: {filteredAdmins.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-secondary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No admins found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Created</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        {admin.firstName} {admin.lastName}
                      </td>
                      <td className="py-4 px-4">{admin.email}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAdmin(admin)
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteAdmin(admin.id)}
                            disabled={deleteLoading === admin.id}
                          >
                            {deleteLoading === admin.id ? (
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Admin Dialog */}
      <CreateAdminDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onAdminCreated={() => {
          setShowCreateDialog(false)
          toast({
            title: "Success",
            description: "Admin account created successfully!",
            variant: "default",
          })
          fetchAdmins()
        }}
      />

      {/* Edit Admin Dialog */}
      {selectedAdmin && (
        <EditAdminDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          admin={selectedAdmin}
          onAdminUpdated={() => {
            setShowEditDialog(false)
            toast({
              title: "Success",
              description: "Admin account updated successfully!",
              variant: "default",
            })
            fetchAdmins()
          }}
        />
      )}
    </div>
  )
}
