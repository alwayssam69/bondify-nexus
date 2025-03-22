
import React from "react";
import Layout from "@/components/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Match platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily access the materials on Match's platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-8 my-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained on Match's platform</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our platform.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the platform and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Content</h2>
          <p>
            Our platform allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post on or through the platform, including its legality, reliability, and appropriateness.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Privacy Policy</h2>
          <p>
            Your use of the Match platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
          <p>
            In no event shall Match, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the platform.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
          <p>
            Match reserves the right, at its sole discretion, to modify or replace these Terms at any time. It is your responsibility to check these Terms periodically for changes. Your continued use of the platform following the posting of any changes to these Terms constitutes acceptance of those changes.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at terms@matchapp.com.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
