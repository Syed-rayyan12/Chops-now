"use client";

import { Search, FileText, MessageCircle, CheckCircle } from "lucide-react";

export function ApplicationProcess() {
  const steps = [
    {
      icon: Search,
      title: "Browse Jobs",
      description: "Explore open positions and find the role that matches your skills and passion"
    },
    {
      icon: FileText,
      title: "Submit Application",
      description: "Complete our simple application form with your resume and cover letter"
    },
    {
      icon: MessageCircle,
      title: "Interview Process",
      description: "Meet our team through phone screening and in-person/virtual interviews"
    },
    {
      icon: CheckCircle,
      title: "Job Offer",
      description: "Receive your offer and join the ChopNow family!"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-orange-50 to-orange-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-fredoka-one font-bold text-gray-900 mb-4">
            Application <span className="text-secondary">Process</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our hiring process is designed to be transparent, efficient, and respectful of your time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-lg shadow-md text-center h-full">
                  <div className="bg-secondary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                    {index + 1}
                  </div>
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="font-ubuntu font-bold text-lg text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <svg
                      className="w-8 h-8 text-secondary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button className="bg-secondary text-white px-8 py-4 rounded-lg font-ubuntu font-semibold hover:bg-secondary/90 transition-colors">
            Start Your Application
          </button>
        </div>
      </div>
    </section>
  );
}
