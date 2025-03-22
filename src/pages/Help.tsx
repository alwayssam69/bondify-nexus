
import React from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Help = () => {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Get Started' button on the homepage. You'll be asked to provide your email address and create a password. You can also sign up using your Google or Facebook account."
    },
    {
      question: "How does the matching algorithm work?",
      answer: "Our matching algorithm considers multiple factors including your skills, interests, location, networking goals, and experience level. We use these factors to find professionals who are most likely to be valuable connections for you."
    },
    {
      question: "Can I change my preferences after signing up?",
      answer: "Yes, you can update your preferences at any time by going to your Profile Settings. Any changes you make will be reflected in your future matches."
    },
    {
      question: "How do I connect with someone?",
      answer: "When you see someone you'd like to connect with, click the 'Connect' button on their profile. They'll receive a notification, and if they accept, you'll be able to start a conversation."
    },
    {
      question: "Is there a limit to how many people I can connect with?",
      answer: "On the free plan, you can connect with up to 10 people per week. Premium subscribers have unlimited connections."
    },
    {
      question: "How do I start a video call?",
      answer: "To start a video call, open a conversation with a connection and click the video icon in the top right corner. Your connection will receive a notification and can choose to accept or decline the call."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security very seriously. All communications are encrypted, and we follow industry best practices to protect your personal information. You can learn more in our Privacy Policy."
    },
    {
      question: "How do I delete my account?",
      answer: "To delete your account, go to Profile Settings and scroll to the bottom. Click on 'Delete Account' and follow the prompts. Please note that this action is permanent and cannot be undone."
    }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions and learn how to get the most out of Match.
          </p>
          
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <Input 
                placeholder="Search for answers..."
                className="pl-10 h-12"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Button className="absolute right-1 top-1 h-10">
                Search
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.slice(0, 4).map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold mb-2 text-lg">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Popular Topics</h2>
            <div className="space-y-6">
              {faqs.slice(4, 8).map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold mb-2 text-lg">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            If you couldn't find the answer you were looking for, our support team is here to help.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <a href="mailto:support@matchapp.com">Email Support</a>
            </Button>
            <Button asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
