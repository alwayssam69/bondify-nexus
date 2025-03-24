
import React from "react";
import Layout from "@/components/layout/Layout";

const About = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            Match is a professional networking platform designed to connect individuals based on shared interests, skills, and career goals.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            Our mission is to foster meaningful professional connections that lead to collaboration, mentorship, and growth opportunities. We believe in the power of community and how the right connections can transform careers.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
          <p>
            Founded in 2023, Match began as a small project aimed at helping professionals find collaborators for side projects. As our community grew, we expanded our vision to encompass all forms of professional networking, from mentorship to business partnerships.
          </p>
          <p>
            Our founding team consists of individuals who experienced firsthand the challenges of finding the right professional connections. This personal experience drives our commitment to creating a platform that truly understands and addresses the needs of our users.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Approach</h2>
          <p>
            We take a human-centered approach to networking. While we use sophisticated algorithms to suggest potential connections, we emphasize the quality of matches over quantity. Our platform is designed to help you find professionals who complement your skills, share your interests, and align with your career goals.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
          <ul className="list-disc pl-8 my-4">
            <li><strong>Authenticity:</strong> We encourage genuine connections based on shared interests and goals.</li>
            <li><strong>Diversity:</strong> We believe in the strength of diverse perspectives and backgrounds.</li>
            <li><strong>Growth:</strong> We're committed to facilitating professional development and learning.</li>
            <li><strong>Privacy:</strong> We respect user data and maintain strict privacy standards.</li>
            <li><strong>Community:</strong> We foster a supportive community where professionals can thrive together.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Join Us</h2>
          <p>
            Whether you're looking for a mentor, a collaborator, or simply wanting to expand your professional network, Match is here to help you form meaningful connections. Join our community today and take the next step in your professional journey.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
