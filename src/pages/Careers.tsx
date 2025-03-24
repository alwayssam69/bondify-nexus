
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const Careers = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Careers at Match</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            Join our team and help us revolutionize professional networking. We're looking for passionate individuals who share our vision of creating meaningful connections.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Why Join Match?</h2>
          <p>
            At Match, we believe in creating an environment where creativity thrives and innovation is encouraged. We offer competitive benefits, a flexible work environment, and the opportunity to make a real impact on how professionals connect and collaborate.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Growth</h3>
              <p className="text-muted-foreground">
                Continuous learning and professional development opportunities
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                Freedom to experiment and bring new ideas to the table
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Balance</h3>
              <p className="text-muted-foreground">
                Flexible work arrangements that respect your personal life
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Open Positions</h2>
          
          <div className="space-y-6 mb-8">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Senior Full Stack Developer</h3>
              <p className="text-muted-foreground mb-4">
                We're looking for an experienced developer to help build and scale our platform. You'll work with modern technologies and have a direct impact on our product's success.
              </p>
              <div className="flex gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Remote</span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Full-time</span>
              </div>
              <Button>Apply Now</Button>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">UX/UI Designer</h3>
              <p className="text-muted-foreground mb-4">
                Help us create intuitive and delightful user experiences. You'll collaborate with our product and engineering teams to bring our vision to life.
              </p>
              <div className="flex gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Remote</span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Full-time</span>
              </div>
              <Button>Apply Now</Button>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Product Marketing Manager</h3>
              <p className="text-muted-foreground mb-4">
                Drive our marketing strategy and help us reach more professionals. You'll be responsible for positioning our product and growing our user base.
              </p>
              <div className="flex gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Remote</span>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">Part-time</span>
              </div>
              <Button>Apply Now</Button>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Application Process</h2>
          <ol className="list-decimal pl-8 my-4">
            <li className="mb-2"><strong>Apply online:</strong> Submit your application through our careers portal.</li>
            <li className="mb-2"><strong>Initial screening:</strong> Our HR team will review your application and reach out for an initial conversation.</li>
            <li className="mb-2"><strong>Technical/Role assessment:</strong> Depending on the role, you may be asked to complete a relevant assessment.</li>
            <li className="mb-2"><strong>Team interviews:</strong> Meet with potential team members and stakeholders.</li>
            <li className="mb-2"><strong>Final decision:</strong> We aim to provide feedback within two weeks of your final interview.</li>
          </ol>
          
          <div className="bg-muted p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-2">Don't see a suitable position?</h3>
            <p className="mb-4">
              We're always looking for talented individuals. Send us your resume and let us know how you can contribute to our mission.
            </p>
            <Button variant="outline">Send Speculative Application</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Careers;
