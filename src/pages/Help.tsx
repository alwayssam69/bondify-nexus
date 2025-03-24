
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Mail, MessageSquare, FileText, HelpCircle } from "lucide-react";

const faqCategories = [
  {
    id: "account",
    title: "Account & Settings",
    faqs: [
      {
        question: "How do I reset my password?",
        answer: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you instructions to reset your password."
      },
      {
        question: "How do I update my profile information?",
        answer: "To update your profile, navigate to your profile page by clicking on your profile picture in the top-right corner and selecting 'Profile'. Then click the 'Edit Profile' tab to make changes to your information."
      },
      {
        question: "Can I change my email address?",
        answer: "Yes, you can change your email address in your account settings. Go to your profile, click on the 'Settings' tab, and update your email address in the 'Account Information' section."
      }
    ]
  },
  {
    id: "matching",
    title: "Matching & Connections",
    faqs: [
      {
        question: "How does the matching algorithm work?",
        answer: "Our matching algorithm considers factors like your skills, interests, industry, experience level, and location preferences to suggest potential connections. The more complete your profile is, the better matches you'll receive."
      },
      {
        question: "Why am I not getting any matches?",
        answer: "There could be several reasons: your profile might be incomplete, your preferences might be too narrow, or there might not be many users matching your criteria in your area. Try expanding your preferences or completing your profile for better results."
      },
      {
        question: "How do I connect with someone?",
        answer: "To connect with someone, visit their profile and click the 'Connect' button. You can add a personalized message to introduce yourself. The person will receive a connection request that they can accept or decline."
      }
    ]
  },
  {
    id: "messaging",
    title: "Messaging & Communication",
    faqs: [
      {
        question: "How do I start a conversation with a connection?",
        answer: "Once you're connected with someone, you can start a conversation by going to the Messages section and selecting their name, or by clicking the 'Message' button on their profile."
      },
      {
        question: "Are my messages private?",
        answer: "Yes, all messages are private and can only be seen by you and the person you're messaging. We do not share message content with third parties."
      },
      {
        question: "Can I delete messages?",
        answer: "Yes, you can delete individual messages or entire conversations. However, please note that this only removes them from your view - the other person will still see the messages unless they also delete them."
      }
    ]
  }
];

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Help Center</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find answers to your questions and learn how to make the most of Match
          </p>
          
          <div className="relative mb-12">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for help..." 
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex flex-col items-center">
                  <MessageSquare className="h-8 w-8 mb-2 text-primary" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  Need personal assistance? Our support team is here to help.
                </CardDescription>
                <Button className="w-full">Get Support</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex flex-col items-center">
                  <FileText className="h-8 w-8 mb-2 text-primary" />
                  Guides & Tutorials
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  Learn how to use Match with our detailed guides and tutorials.
                </CardDescription>
                <Button variant="outline" className="w-full">View Guides</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex flex-col items-center">
                  <HelpCircle className="h-8 w-8 mb-2 text-primary" />
                  Community Forum
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  Connect with other users and share tips in our community forum.
                </CardDescription>
                <Button variant="outline" className="w-full">Join Forum</Button>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          
          <Tabs defaultValue="account">
            <TabsList className="mb-6">
              {faqCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {faqCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <Accordion type="single" collapsible>
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-semibold mb-6">Still Need Help?</h2>
            <div className="bg-muted p-6 rounded-lg">
              <p className="mb-4">
                Our support team is ready to assist you with any questions or issues you might have.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <Button className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </Button>
                <Button variant="outline">
                  Live Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
