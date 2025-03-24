
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

const Community = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Community Guidelines</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            Our community guidelines are designed to ensure Match remains a positive, professional, and productive space for all members. By joining our platform, you agree to follow these guidelines in all your interactions.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Core Principles</h2>
          <p>
            All guidelines stem from these fundamental principles:
          </p>
          
          <ul className="list-disc pl-8 my-4">
            <li><strong>Respect:</strong> Treat all community members with respect, regardless of background, experience level, or viewpoints.</li>
            <li><strong>Authenticity:</strong> Be genuine in your interactions and represent yourself truthfully.</li>
            <li><strong>Professionalism:</strong> Maintain professional conduct in all communications and activities on the platform.</li>
            <li><strong>Constructive Engagement:</strong> Focus on helpful, positive, and meaningful interactions.</li>
            <li><strong>Safety:</strong> Prioritize your safety and the safety of others in all online and offline interactions.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Acceptable Behavior</h2>
          <div className="space-y-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Sharing Professional Insights</h3>
                    <p className="text-muted-foreground">
                      Contributing your knowledge, experiences, and expertise to help others grow professionally.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Constructive Feedback</h3>
                    <p className="text-muted-foreground">
                      Offering thoughtful, helpful feedback when requested, focusing on improvement rather than criticism.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Meaningful Networking</h3>
                    <p className="text-muted-foreground">
                      Building connections with purpose, clearly stating your intentions, and respecting others' networking preferences.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Prohibited Behavior</h2>
          <div className="space-y-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Harassment and Discrimination</h3>
                    <p className="text-muted-foreground">
                      Any form of harassment, hate speech, or discrimination based on race, gender, sexuality, religion, nationality, disability, or any other personal characteristic.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Spamming and Solicitation</h3>
                    <p className="text-muted-foreground">
                      Excessive self-promotion, unsolicited commercial messages, pyramid schemes, or any form of spamming.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Misrepresentation</h3>
                    <p className="text-muted-foreground">
                      False information about your identity, qualifications, or affiliations, including creating fake profiles or impersonating others.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Inappropriate Content</h3>
                    <p className="text-muted-foreground">
                      Sharing explicit, offensive, or illegal content, including but not limited to pornography, violence, or content that promotes illegal activities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Consequences for Violations</h2>
          <p>
            Violations of these guidelines may result in:
          </p>
          
          <ul className="list-disc pl-8 my-4">
            <li><strong>Content Removal:</strong> Inappropriate content may be removed without notice.</li>
            <li><strong>Warnings:</strong> Initial violations may result in a warning and explanation of the guideline violated.</li>
            <li><strong>Temporary Suspension:</strong> Repeated or serious violations may lead to temporary account suspension.</li>
            <li><strong>Permanent Ban:</strong> Severe or continued violations after warnings may result in permanent removal from the platform.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Reporting Violations</h2>
          <p>
            If you encounter behavior that violates these guidelines:
          </p>
          
          <ol className="list-decimal pl-8 my-4">
            <li>Use the "Report" feature available on profiles, messages, and content.</li>
            <li>Provide specific details about the violation.</li>
            <li>Our team will review the report and take appropriate action.</li>
            <li>For urgent concerns, contact us directly at community@matchapp.com.</li>
          </ol>
          
          <div className="bg-muted p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-2">Our Commitment</h3>
            <p>
              We're committed to maintaining a professional, inclusive, and productive community. These guidelines may be updated periodically to address emerging issues and community needs. We appreciate your participation in upholding these standards and helping Match remain a valuable resource for professional networking.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
