
import React from "react";
import { motion } from "framer-motion";
import { Shield, Users, MessageCircle, Video, Globe, Award } from "lucide-react";

const WhatWeOffer = () => {
  const offeringItems = [
    {
      icon: <Users className="h-8 w-8 text-blue-400" />,
      title: "Smart Matching",
      description: "Our algorithm considers your personality, interests, and relationship goals to find the most compatible matches."
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-indigo-400" />,
      title: "Real-Time Chat",
      description: "Connect instantly with your matches through our intuitive messaging system with read receipts and typing indicators."
    },
    {
      icon: <Video className="h-8 w-8 text-purple-400" />,
      title: "Video Calls",
      description: "Build deeper connections with secure, high-quality video calls right from our platform."
    },
    {
      icon: <Globe className="h-8 w-8 text-cyan-400" />,
      title: "Location-Based Matching",
      description: "Find professionals near you with real-time location features and customizable search radius."
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-400" />,
      title: "Privacy & Security",
      description: "Your data is protected with end-to-end encryption and stringent privacy controls."
    },
    {
      icon: <Award className="h-8 w-8 text-amber-400" />,
      title: "Professional Verification",
      description: "Connect with confidence knowing our members are verified professionals in their fields."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="what-we-offer" className="py-20 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-1 opacity-40"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            What We Offer
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Connect with like-minded professionals through our cutting-edge platform designed to build meaningful relationships
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {offeringItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card-3d bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:shadow-glow transition-all duration-300"
            >
              <div className="card-3d-inner">
                <div className="mb-4 bg-gradient-to-br from-gray-800 to-gray-700 p-4 rounded-xl inline-block">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
