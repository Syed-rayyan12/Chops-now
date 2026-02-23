"use client";

import { Heart, TrendingUp, Award, Coffee, Users, Zap } from "lucide-react";

export function WhyJoinChopNow() {
  const benefits = [
    {
      icon: Heart,
      title: "Work-Life Balance",
      description: "Flexible working hours and remote options to help you maintain a healthy balance"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Clear career progression paths with mentorship and learning opportunities"
    },
    {
      icon: Award,
      title: "Competitive Benefits",
      description: "Health insurance, paid leave, performance bonuses, and more"
    },
    {
      icon: Coffee,
      title: "Great Culture",
      description: "Join a diverse, inclusive team that values innovation and collaboration"
    },
    {
      icon: Users,
      title: "Make an Impact",
      description: "Help revolutionize food delivery and connect communities with authentic cuisine"
    },
    {
      icon: Zap,
      title: "Innovation First",
      description: "Work with cutting-edge technology and contribute to exciting projects"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-fredoka-one font-bold text-gray-900 mb-4">
            Why Join <span className="text-secondary">ChopNow?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Be part of a company that's transforming the food delivery industry while taking care of its people
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-ubuntu font-bold text-xl text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
