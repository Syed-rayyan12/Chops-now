"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, FileText, Calendar, Loader2 } from "lucide-react";
import { API_CONFIG } from "@/lib/api/config";

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  expectedSalary?: string;
  availableDate?: string;
  status: string;
  createdAt: string;
  job: {
    title: string;
    department: string;
  };
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/applications`);
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert("Application status updated");
        fetchApplications();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update status");
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin-dashboard"
          className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === "all"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setFilter("new")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === "new"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            New ({applications.filter((a) => a.status === "new").length})
          </button>
          <button
            onClick={() => setFilter("reviewed")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === "reviewed"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Reviewed ({applications.filter((a) => a.status === "reviewed").length})
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No applications found
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{application.fullName}</h3>
                  <p className="text-sm text-gray-500">Applied for: {application.job.title}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold">
                    {application.job.department}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <select
                    value={application.status}
                    onChange={(e) => updateStatus(application.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <span className="text-xs text-gray-500 text-center">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${application.email}`} className="hover:text-orange-600">
                    {application.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${application.phone}`} className="hover:text-orange-600">
                    {application.phone}
                  </a>
                </div>
                {application.expectedSalary && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Expected: {application.expectedSalary}
                  </div>
                )}
                {application.availableDate && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Available: {new Date(application.availableDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              {application.resumeUrl && (
                <div className="mt-4">
                  <a
                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://nodejs-production-c43f.up.railway.app'}${application.resumeUrl}`}
                    download
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Download Resume
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
