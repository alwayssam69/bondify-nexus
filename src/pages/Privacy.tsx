
import React from "react";
import Layout from "@/components/layout/Layout";

const Privacy = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Match ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the platform.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you:
          </p>
          <ul className="list-disc pl-8 my-4">
            <li>Create or modify your account</li>
            <li>Complete your profile</li>
            <li>Participate in surveys or feedback</li>
            <li>Contact customer support</li>
            <li>Communicate with other users</li>
          </ul>
          <p>
            This information may include your name, email address, phone number, location, profile picture, bio, skills, interests, and other information you choose to provide.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-8 my-4">
            <li>Provide, maintain, and improve our platform</li>
            <li>Match you with other users based on your preferences</li>
            <li>Process and complete transactions</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, prevent, and address fraud and other illegal activities</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. How We Share Your Information</h2>
          <p>
            We may share your information with:
          </p>
          <ul className="list-disc pl-8 my-4">
            <li>Other users as part of the platform's functionality</li>
            <li>Service providers who perform services on our behalf</li>
            <li>Legal authorities when required by law</li>
          </ul>
          <p>
            We will not sell your personal information to third parties.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </p>
          <p>
            However, no method of transmission over the Internet or electronic storage is 100% secure. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul className="list-disc pl-8 my-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Delete your personal information</li>
            <li>Object to the processing of your personal information</li>
            <li>Request the restriction of processing of your personal information</li>
            <li>Request the transfer of your personal information</li>
            <li>Withdraw consent</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@matchapp.com.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
