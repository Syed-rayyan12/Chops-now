"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Mail,
  Phone,
  FileText,
  Calendar,
  Loader2,
} from "lucide-react";
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
}

interface Job {
  id: string;
  title: string;
  department: string;
  jobType: string;
  location: string;
  salaryRange?: string;
  description: string;
  requirements: string;
  responsibilities: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  applications: Application[];
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchJob(params.id as string);
    }
  }, [params.id]);

  const fetchJob = async (id: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/jobs/${id}`);
      if (!response.ok) {
        throw new Error("Job not found");
      }
      const data = await response.json();
      setJob(data.job);
    } catch (err: any) {
      setError(err.message || "Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (appId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/applications/${appId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        // Refresh job data to get updated application statuses
        fetchJob(params.id as string);
      } else {
        alert("Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update application status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg mb-4">{error || "Job not found"}</p>
          <Link
            href="/admin-dashboard/jobs"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            &larr; Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "reviewed":
        return "bg-yellow-100 text-yellow-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin-dashboard/jobs"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-500 mt-1">{job.department}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              job.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {job.status}
          </span>
        </div>
      </div>

      {/* Job Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-orange-500" />
          <div>
            <p className="text-xs text-gray-500">Type</p>
            <p className="text-sm font-medium text-gray-900">{job.jobType}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <MapPin className="w-5 h-5 text-orange-500" />
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm font-medium text-gray-900">{job.location}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-orange-500" />
          <div>
            <p className="text-xs text-gray-500">Salary</p>
            <p className="text-sm font-medium text-gray-900">
              {job.salaryRange || "Not specified"}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <Users className="w-5 h-5 text-orange-500" />
          <div>
            <p className="text-xs text-gray-500">Applications</p>
            <p className="text-sm font-medium text-gray-900">
              {job.applications.length}
            </p>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h2>
            <p className="text-gray-600 whitespace-pre-line">{job.requirements}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Responsibilities</h2>
            <p className="text-gray-600 whitespace-pre-line">{job.responsibilities}</p>
          </div>

          <div className="pt-4 border-t text-sm text-gray-400">
            Posted on{" "}
            {new Date(job.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Applications ({job.applications.length})
          </h2>

          {job.applications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No applications received yet.
            </p>
          ) : (
            <div className="space-y-4">
              {job.applications.map((app) => (
                <div
                  key={app.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{app.fullName}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {app.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {app.phone}
                        </span>
                        {app.expectedSalary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {app.expectedSalary}
                          </span>
                        )}
                        {app.availableDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {app.availableDate}
                          </span>
                        )}
                      </div>
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-sm text-orange-500 hover:text-orange-600"
                        >
                          <FileText className="w-4 h-4" />
                          View Resume
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateApplicationStatus(app.id, e.target.value)
                        }
                        className="text-sm border rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Applied{" "}
                    {new Date(app.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
