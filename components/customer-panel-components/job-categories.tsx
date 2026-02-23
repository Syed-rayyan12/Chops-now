"use client";

import { Briefcase, Users, TrendingUp, HeadphonesIcon, Code, Palette, BarChart, Settings } from "lucide-react";

export function JobCategories() {
  const corporateRoles = [
    { title: "Software Engineer", icon: Code, description: "Build cutting-edge food delivery solutions" },
    { title: "Marketing Manager", icon: TrendingUp, description: "Drive brand growth and customer acquisition" },
    { title: "Customer Support Lead", icon: HeadphonesIcon, description: "Ensure exceptional customer experiences" },
    { title: "Product Manager", icon: Briefcase, description: "Shape the future of our platform" },
    { title: "UI/UX Designer", icon: Palette, description: "Create beautiful user experiences" },
    { title: "Data Analyst", icon: BarChart, description: "Turn data into actionable insights" },
  ];

  const serviceRoles = [
    { title: "Operations Manager", icon: Settings, description: "Optimize daily operations and logistics" },
    { title: "Quality Assurance Specialist", icon: Users, description: "Maintain our high-quality standards" },
    { title: "Training Coordinator", icon: Users, description: "Develop and deliver training programs" },
    { title: "Area Supervisor", icon: Briefcase, description: "Oversee regional operations" },
    { title: "Logistics Coordinator", icon: TrendingUp, description: "Streamline delivery operations" },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-fredoka-one font-bold text-gray-900 mb-4">
            Open <span className="text-secondary">Positions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore exciting career opportunities across different departments and find your perfect role
          </p>
        </div>

        {/* Corporate Roles */}
        <div className="mb-12">
          <h3 className="text-2xl font-fredoka-one font-bold text-gray-900 mb-6">
            Corporate / In-House Roles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {corporateRoles.map((role, index) => {
              const Icon = role.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary/10 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-ubuntu font-bold text-lg text-gray-900 mb-2">
                        {role.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{role.description}</p>
                      <button className="mt-4 text-secondary hover:text-secondary/80 font-semibold text-sm">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Team Roles */}
        <div>
          <h3 className="text-2xl font-fredoka-one font-bold text-gray-900 mb-6">
            Service Team Roles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceRoles.map((role, index) => {
              const Icon = role.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary/10 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-ubuntu font-bold text-lg text-gray-900 mb-2">
                        {role.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{role.description}</p>
                      <button className="mt-4 text-secondary hover:text-secondary/80 font-semibold text-sm">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
