"use client";

import { Briefcase, Users, TrendingUp, HeadphonesIcon, Wallet, Settings, Award, Package } from "lucide-react";

export function JobCategories() {
  const corporateRoles = [
    { title: "Restaurant Partnership Manager", icon: Briefcase, description: "Onboard and manage restaurant partnerships" },
    { title: "Driver Recruitment Manager", icon: Users, description: "Recruit and onboard delivery drivers" },
    { title: "Customer Support Manager", icon: HeadphonesIcon, description: "Lead customer support operations" },
    { title: "Marketing Manager", icon: TrendingUp, description: "Promote ChopNow and drive growth" },
    { title: "Operations Manager", icon: Settings, description: "Oversee daily platform operations" },
    { title: "Finance Manager", icon: Wallet, description: "Handle payments and accounting" },
    { title: "Quality Assurance Manager", icon: Award, description: "Ensure food quality and safety standards" },
    { title: "HR Manager", icon: Users, description: "Manage employee relations and recruitment" },
  ];

  const serviceRoles = [
    { title: "Customer Service Representative", icon: HeadphonesIcon, description: "Support customers with queries and issues" },
    { title: "Delivery Operations Coordinator", icon: Package, description: "Coordinate delivery logistics" },
    { title: "Training Coordinator", icon: Award, description: "Train drivers and staff members" },
    { title: "Area Supervisor", icon: Briefcase, description: "Supervise operations in specific zones" },
    { title: "Warehouse Manager", icon: Package, description: "Manage inventory and warehouse operations" },
    { title: "Logistics Coordinator", icon: TrendingUp, description: "Optimize delivery routes and schedules" },
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
