
import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">Match</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Connect with professionals who share your interests and career goals with our intelligent matching platform.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/press" className="text-muted-foreground hover:text-primary transition-colors">Press</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/safety" className="text-muted-foreground hover:text-primary transition-colors">Safety Center</Link></li>
              <li><Link to="/community" className="text-muted-foreground hover:text-primary transition-colors">Community Guidelines</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                <Mail className="h-4 w-4" /> Contact Us
              </Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookie" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link to="/accessibility" className="text-muted-foreground hover:text-primary transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Delhi, India</span>
            </div>
            <div className="hidden md:block text-muted-foreground">•</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>+91 9898989898</span>
            </div>
            <div className="hidden md:block text-muted-foreground">•</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>contact@matchapp.com</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Match. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
