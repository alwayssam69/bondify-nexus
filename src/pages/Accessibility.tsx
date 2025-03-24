
import React from "react";
import Layout from "@/components/layout/Layout";

const Accessibility = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Accessibility Statement</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            Match is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Commitment</h2>
          <p>
            We strive to ensure that our platform is accessible to all users, regardless of their abilities or the technologies they use to navigate the web. Our goal is to meet WCAG 2.1 AA standards across our entire platform.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Accessibility Features</h2>
          <p>
            Our platform includes the following accessibility features:
          </p>
          
          <ul className="list-disc pl-8 my-4">
            <li><strong>Keyboard Navigation:</strong> All functionality is operable through a keyboard interface.</li>
            <li><strong>Screen Reader Compatibility:</strong> Our content is structured to work with screen readers and other assistive technologies.</li>
            <li><strong>Text Alternatives:</strong> We provide text alternatives for non-text content.</li>
            <li><strong>Resizable Text:</strong> Text can be resized without loss of content or functionality.</li>
            <li><strong>Color Contrast:</strong> We ensure sufficient contrast between text and background colors.</li>
            <li><strong>Clear Headings and Labels:</strong> Content is organized with clear headings and form controls have associated labels.</li>
            <li><strong>Focus Indicators:</strong> Visible focus indicators help keyboard users navigate.</li>
            <li><strong>Error Identification:</strong> Input errors are clearly identified and described to users.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Conformance Status</h2>
          <p>
            The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
          </p>
          <p>
            Match is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Compatibility with Browsers and Assistive Technology</h2>
          <p>
            Match is designed to be compatible with the following assistive technologies:
          </p>
          <ul className="list-disc pl-8 my-4">
            <li>Screen readers (including NVDA, JAWS, VoiceOver, and TalkBack)</li>
            <li>Text magnifiers</li>
            <li>Voice recognition software</li>
            <li>Keyboard-only navigation</li>
          </ul>
          <p>
            We support the recent versions of major browsers including Chrome, Firefox, Safari, and Edge.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Technical Specifications</h2>
          <p>
            Accessibility of Match relies on the following technologies to work:
          </p>
          <ul className="list-disc pl-8 my-4">
            <li>HTML</li>
            <li>WAI-ARIA</li>
            <li>CSS</li>
            <li>JavaScript</li>
          </ul>
          <p>
            These technologies are relied upon for conformance with the accessibility standards used.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Limitations and Alternatives</h2>
          <p>
            Despite our best efforts to ensure the accessibility of Match, there may be some limitations:
          </p>
          <ul className="list-disc pl-8 my-4">
            <li>Some third-party content may not be fully accessible</li>
            <li>Some older content may not yet meet all of our accessibility standards</li>
            <li>Some interactive features may not be fully optimized for all assistive technologies</li>
          </ul>
          <p>
            If you encounter an accessibility barrier on Match, please contact us. We'll work to address the issue or provide an alternative.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Feedback</h2>
          <p>
            We welcome your feedback on the accessibility of Match. Please let us know if you encounter accessibility barriers:
          </p>
          <ul className="list-disc pl-8 my-4">
            <li>Email: accessibility@matchapp.com</li>
            <li>Phone: +91 9898989898</li>
            <li>Postal address: 123 Tech Park, Delhi, India</li>
          </ul>
          <p>
            We aim to respond to feedback within 3 business days.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Continuous Improvement</h2>
          <p>
            We are committed to continually improving the accessibility of our platform. This includes:
          </p>
          <ul className="list-disc pl-8 my-4">
            <li>Regular accessibility audits and testing</li>
            <li>Training for our development and content teams</li>
            <li>Incorporating accessibility feedback from users</li>
            <li>Staying current with evolving accessibility standards and technologies</li>
          </ul>
          
          <div className="bg-muted p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-2">Assessment and Enforcement</h3>
            <p>
              This statement was last reviewed on {new Date().toLocaleDateString()}. It will be reviewed and updated when substantial changes are made to the platform.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Accessibility;
