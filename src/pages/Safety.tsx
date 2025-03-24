
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, Lock, Eye, Bell } from "lucide-react";

const Safety = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Safety Center</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            At Match, your safety and privacy are our top priorities. We've developed comprehensive measures to ensure a secure networking experience.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Account Security</h3>
                    <p className="text-muted-foreground">
                      Protect your account with strong passwords and two-factor authentication.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Reporting Issues</h3>
                    <p className="text-muted-foreground">
                      Easy reporting tools to flag inappropriate behavior or content.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Privacy Controls</h3>
                    <p className="text-muted-foreground">
                      Manage who can see your profile and contact you through detailed privacy settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Safety Alerts</h3>
                    <p className="text-muted-foreground">
                      Receive notifications about suspicious activities related to your account.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Staying Safe While Networking</h2>
          <p>
            While we take extensive measures to create a safe platform, we also encourage users to follow these best practices:
          </p>
          
          <ul className="list-disc pl-8 my-4">
            <li><strong>Protect Your Personal Information</strong> - Be cautious about sharing sensitive personal details, especially with new connections.</li>
            <li><strong>Meet in Public Places</strong> - If you decide to meet a connection in person, choose public locations for your first few meetings.</li>
            <li><strong>Trust Your Instincts</strong> - If something doesn't feel right about a connection, trust your gut feeling.</li>
            <li><strong>Keep Conversations on the Platform</strong> - Use our messaging system for initial communications to maintain a record of interactions.</li>
            <li><strong>Report Suspicious Behavior</strong> - Don't hesitate to report any concerning behavior or requests that make you uncomfortable.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Privacy Protection</h2>
          <p>
            We've designed Match with privacy at its core. You have control over:
          </p>
          
          <ul className="list-disc pl-8 my-4">
            <li><strong>Profile Visibility</strong> - Choose who can view your full profile information.</li>
            <li><strong>Contact Permissions</strong> - Decide who can send you connection requests and messages.</li>
            <li><strong>Location Sharing</strong> - Control whether and with whom you share your location.</li>
            <li><strong>Activity Status</strong> - Manage when others can see when you're online.</li>
          </ul>
          <p>
            For complete details on how we handle your data, please review our <a href="/privacy" className="text-primary underline">Privacy Policy</a>.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Reporting Issues</h2>
          <p>
            If you encounter inappropriate behavior, content, or have safety concerns, please report them immediately. Our team reviews all reports and takes appropriate action, which may include:
          </p>
          
          <ul className="list-disc pl-8 my-4">
            <li>Issuing warnings to users</li>
            <li>Temporarily suspending accounts</li>
            <li>Permanently removing users from the platform</li>
            <li>Involving law enforcement when necessary</li>
          </ul>
          
          <div className="bg-muted p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-2">Need Immediate Assistance?</h3>
            <p className="mb-4">
              If you're facing an urgent safety concern related to Match, please contact our Trust & Safety team immediately at <strong>safety@matchapp.com</strong>.
            </p>
            <p className="text-muted-foreground">
              For emergencies that require immediate attention from authorities, please contact your local emergency services first, then inform us about the situation.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Safety;
