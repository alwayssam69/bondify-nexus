
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const pressReleases = [
  {
    id: 1,
    title: "Match Secures $10M in Series A Funding to Revolutionize Professional Networking",
    date: "March 15, 2025",
    excerpt: "The funding will be used to expand the platform's AI-driven matching capabilities and enter new markets."
  },
  {
    id: 2,
    title: "Match Partners with Leading Universities to Connect Students with Industry Mentors",
    date: "February 28, 2025",
    excerpt: "The program aims to bridge the gap between academic learning and professional practice."
  },
  {
    id: 3,
    title: "Match Reaches 1 Million User Milestone",
    date: "January 20, 2025",
    excerpt: "The platform celebrates rapid growth and high user engagement rates in its first year."
  }
];

const mediaFeatures = [
  {
    id: 1,
    publication: "Tech Innovators",
    title: "How Match is Using AI to Transform Professional Networking",
    date: "March 10, 2025",
    link: "#"
  },
  {
    id: 2,
    publication: "Business Weekly",
    title: "The Future of Work: Platforms Like Match Are Changing How Professionals Connect",
    date: "February 22, 2025",
    link: "#"
  },
  {
    id: 3,
    publication: "Digital Trends",
    title: "Match Named Among Top 10 Startups to Watch in 2025",
    date: "January 15, 2025",
    link: "#"
  }
];

const Press = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Press and Media</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release) => (
              <div key={release.id} className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">{release.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{release.date}</p>
                <p className="mb-4">{release.excerpt}</p>
                <Button variant="outline" size="sm">Read Full Release</Button>
              </div>
            ))}
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Media Features</h2>
          <div className="space-y-4">
            {mediaFeatures.map((feature) => (
              <div key={feature.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{feature.publication}</p>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.date}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={feature.link} target="_blank" rel="noopener noreferrer">Read Article</a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Media Kit</h2>
          <div className="bg-muted rounded-lg p-6">
            <p className="mb-4">
              Our media kit includes logos, brand guidelines, product screenshots, and executive headshots for press use.
            </p>
            <Button>Download Media Kit</Button>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-6">Media Inquiries</h2>
          <div className="bg-muted rounded-lg p-6">
            <p className="mb-4">
              For press inquiries, interview requests, or additional information, please contact our press team.
            </p>
            <div className="mb-4">
              <p className="font-medium">Media Contact:</p>
              <p>press@matchapp.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
            <Button variant="outline">Contact Press Team</Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Press;
