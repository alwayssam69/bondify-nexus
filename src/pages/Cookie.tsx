
import React from "react";
import Layout from "@/components/layout/Layout";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Cookie = () => {
  const [essentialCookies, setEssentialCookies] = React.useState(true);
  const [analyticsCookies, setAnalyticsCookies] = React.useState(true);
  const [marketingCookies, setMarketingCookies] = React.useState(false);
  const [personalizedCookies, setPersonalizedCookies] = React.useState(false);
  
  const handleSavePreferences = () => {
    // In a real app, this would save preferences to localStorage or a backend
    toast.success("Cookie preferences saved successfully!");
  };
  
  const handleAcceptAll = () => {
    setEssentialCookies(true);
    setAnalyticsCookies(true);
    setMarketingCookies(true);
    setPersonalizedCookies(true);
    toast.success("All cookies accepted!");
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What Are Cookies</h2>
          <p>
            Cookies are small text files that are stored on your browser or device by websites, apps, online media, and advertisements. We use cookies to:
          </p>
          <ul className="list-disc pl-8 my-4">
            <li>Authenticate users</li>
            <li>Remember user preferences and settings</li>
            <li>Analyze how our website is used so we can improve it</li>
            <li>Personalize content and advertising</li>
            <li>Facilitate social media features</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Types of Cookies We Use</h2>
          
          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Essential Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies are necessary for the website to function and cannot be switched off in our systems.
                </p>
              </div>
              <Switch
                checked={essentialCookies}
                onCheckedChange={setEssentialCookies}
                disabled={true}
              />
            </div>
            
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Analytics Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
                </p>
              </div>
              <Switch
                checked={analyticsCookies}
                onCheckedChange={setAnalyticsCookies}
              />
            </div>
            
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Marketing Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies help us show you relevant advertisements on other websites and measure the performance of our advertising campaigns.
                </p>
              </div>
              <Switch
                checked={marketingCookies}
                onCheckedChange={setMarketingCookies}
              />
            </div>
            
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Personalization Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies enable personalized features and content based on your browsing and usage patterns.
                </p>
              </div>
              <Switch
                checked={personalizedCookies}
                onCheckedChange={setPersonalizedCookies}
              />
            </div>
          </div>
          
          <div className="flex gap-4 mb-8">
            <Button onClick={handleSavePreferences}>
              Save Preferences
            </Button>
            <Button variant="outline" onClick={handleAcceptAll}>
              Accept All Cookies
            </Button>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How to Manage Cookies</h2>
          <p>
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul className="list-disc pl-8 my-4">
            <li>Delete cookies from your device</li>
            <li>Block cookies by activating the setting on your browser that allows you to refuse all or some cookies</li>
            <li>Set your browser to notify you when you receive a cookie</li>
          </ul>
          <p>
            Please note that if you choose to block all cookies, you may not be able to access all or parts of our site, or functionality may be limited.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Cookies</h2>
          <p>
            We also use third-party cookies from services such as Google Analytics, social media platforms, and advertising partners. These third parties may use cookies, web beacons, and similar technologies to collect or receive information from our website and elsewhere on the internet and use that information to provide measurement services and target ads.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Updates to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will become effective when we post the revised policy on this page. We encourage you to check back periodically to stay informed about our use of cookies.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at privacy@matchapp.com.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Cookie;
