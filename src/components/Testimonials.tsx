
import React from "react";
import { motion } from "framer-motion";
import { Star, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Startup Founder",
      location: "Delhi",
      quote: "This app helped me find my first co-founder in minutes! The matching algorithm is incredibly accurate.",
      rating: 5,
      image: "RS"
    },
    {
      name: "Priya Patel",
      role: "UX Designer",
      location: "Bangalore",
      quote: "I've connected with amazing mentors who have helped me advance my career. The video calling feature makes networking so much easier.",
      rating: 5,
      image: "PP"
    },
    {
      name: "Vikram Mehta",
      role: "Product Manager",
      location: "Mumbai",
      quote: "Found three potential clients in my first week! The location-based matching helped me connect with professionals in my city.",
      rating: 5,
      image: "VM"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-indigo-950 to-indigo-900 dark:from-indigo-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white tracking-tight">
            <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Success Stories
            </span>
          </h2>
          <div className="mt-6 inline-block mb-4">
            <div className="flex items-center gap-2 bg-indigo-800/60 dark:bg-indigo-800/40 rounded-full py-2 px-5">
              <span className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"></span>
              <span className="text-base font-medium text-purple-200">Real People, Real Connections</span>
            </div>
          </div>
          <p className="text-gray-200 dark:text-gray-300 max-w-2xl mx-auto text-lg mt-6">
            Join thousands of professionals who have already expanded their networks and discovered new opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-indigo-800/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-indigo-700/50 hover:shadow-indigo-700/10 hover:border-indigo-500/50 transition-all"
            >
              {/* Stars */}
              <div className="flex mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-gray-200 mb-6 italic">"{testimonial.quote}"</p>
              
              {/* User info */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-indigo-200">{testimonial.role} • {testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
