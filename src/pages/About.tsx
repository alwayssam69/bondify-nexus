
import React from "react";
import Layout from "@/components/layout/Layout";

const About = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        
        <div className="prose max-w-none">
          <p className="lead text-xl mb-8">
            Match is a professional networking platform designed to connect like-minded professionals based on skills, interests, and career goals.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            Our mission is to create meaningful professional connections that help people advance their careers, find collaborators, and build valuable business relationships.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
          <p>
            We envision a world where professional networking is accessible, efficient, and valuable for everyone, regardless of their background or location.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
          <p>
            Match was founded in 2023 by a team of professionals who were frustrated with the limitations of traditional networking platforms. We set out to create a solution that would make it easier for people to connect with others who share their professional interests and goals.
          </p>
          <p>
            Today, Match is used by thousands of professionals across India and is growing rapidly. Our intelligent matching algorithm helps users find the perfect connections, and our platform provides the tools they need to build meaningful relationships.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
          <p>
            Our team is made up of passionate individuals who are dedicated to creating the best possible networking experience for our users. We come from diverse backgrounds and bring a wealth of experience to the table.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Join Us</h2>
          <p>
            We're always looking for talented individuals to join our team. If you're passionate about helping people connect and build meaningful relationships, we'd love to hear from you.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
