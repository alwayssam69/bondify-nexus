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
    <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 bg-blue-50 rounded-full py-1 px-4">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium text-blue-900">Success Stories</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
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
              className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-all"
            >
              {/* Stars */}
              <div className="flex mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              
              {/* User info */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role} • {testimonial.location}</p>
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
