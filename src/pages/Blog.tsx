
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: 1,
    title: "How to Make the Most of Your Professional Network",
    excerpt: "Discover strategies for nurturing and leveraging your professional connections effectively.",
    date: "March 20, 2025",
    author: "Alex Johnson",
    category: "Networking",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2084&q=80"
  },
  {
    id: 2,
    title: "The Art of Meaningful Professional Connections",
    excerpt: "Learn how to build deeper relationships in your professional life that go beyond superficial networking.",
    date: "March 15, 2025",
    author: "Maya Patel",
    category: "Relationships",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 3,
    title: "5 Ways AI is Transforming Professional Networking",
    excerpt: "Explore how artificial intelligence is changing the way professionals connect and collaborate.",
    date: "March 10, 2025",
    author: "Sam Taylor",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 4,
    title: "Remote Networking: Building Connections from Anywhere",
    excerpt: "Tips and strategies for effective networking in a remote-first world.",
    date: "March 5, 2025",
    author: "Jordan Lee",
    category: "Remote Work",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  }
];

const Blog = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Match Blog</h1>
          <p className="text-xl text-muted-foreground">
            Insights, tips, and stories about professional networking and career development
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {blogPosts.map((post) => (
            <div key={post.id} className="border rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium bg-muted px-2.5 py-0.5 rounded">{post.category}</span>
                  <span className="text-sm text-muted-foreground ml-2">{post.date}</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">By {post.author}</span>
                  <Button variant="outline" size="sm">Read More</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button>Load More Articles</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
