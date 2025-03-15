
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 md:p-16">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 left-0 w-full h-full bg-slate-900 opacity-30 mix-blend-multiply"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-10"></div>
            <div className="absolute top-1/3 right-0 w-80 h-80 bg-blue-300 rounded-full filter blur-3xl opacity-10"></div>
          </div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-slate-300 mb-8 text-lg">
              Join thousands of users who have already found meaningful connections on our platform. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="default" className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-8 shadow-button h-12 transition-all hover:shadow-md">
                  Create Account
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-white border-white/30 hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
