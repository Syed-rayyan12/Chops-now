"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Briefcase } from "lucide-react";
import { JobApplicationModal } from "./job-application-modal";
import { API_CONFIG } from "@/lib/api/config";

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
}

export function JobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/jobs`);
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-ubuntu">Loading job listings...</p>
          </div>
        </div>
      </section>
    );
  }

  if (jobs.length === 0) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-fredoka-one font-bold text-gray-900 mb-4">
            Current Openings
          </h2>
          <p className="text-gray-600 font-ubuntu">
            No positions available at the moment. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-fredoka-one font-bold text-gray-900 mb-4">
            Current <span className="text-secondary">Openings</span>
          </h2>
          <p className="text-lg text-gray-600 font-ubuntu">
            Apply now and join our team
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow"
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-ubuntu font-semibold">
                  {job.department}
                </span>
              </div>

              <h3 className="text-xl font-fredoka-one font-bold text-gray-900 mb-3">
                {job.title}
              </h3>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="font-ubuntu">{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="font-ubuntu">{job.jobType}</span>
                </div>
                {job.salaryRange && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Briefcase className="w-4 h-4 flex-shrink-0" />
                    <span className="font-ubuntu">{job.salaryRange}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleApplyClick(job)}
                className="w-full bg-secondary hover:bg-secondary/90 text-white font-ubuntu font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}
    </section>
  );
}
