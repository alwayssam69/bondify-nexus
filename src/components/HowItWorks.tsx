
import React from "react";
import { UserPlus, Users, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: "Sign Up & Set Preferences",
      description: "Create your profile and set your skills, interests, location, and networking goals."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Get Matched Instantly",
      description: "Our algorithm finds the most relevant professionals based on your preferences."
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Start Meaningful Conversations",
      description: "Connect through instant chat, video, or audio calls to build your professional network."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-blue-50 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 bg-blue-50 rounded-full py-1 px-4">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium text-blue-900">How It Works</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Steps to Grow Your Network</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform makes it easy to connect with professionals who share your interests and career goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all h-full border border-blue-100">
                <div className="w-16 h-16 mb-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Step number */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
