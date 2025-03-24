
import { ArrowRightIcon } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      name: 'Create Your Profile',
      description: 'Sign up and create your professional profile with your skills, experience, and preferences.',
    },
    {
      name: 'Find Matches',
      description: 'Our smart matching system connects you with professionals who align with your interests and goals.',
    },
    {
      name: 'Connect & Chat',
      description: 'Start meaningful conversations through chat or video calls with your new connections.',
    },
    {
      name: 'Grow Your Network',
      description: 'Build and maintain professional relationships that help you achieve your career goals.',
    },
  ];

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
            Get Started
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Start growing your professional network in four simple steps
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24">
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-4 lg:gap-x-8">
            {steps.map((step, index) => (
              <div key={step.name} className="relative pl-9">
                <div className="flex items-center gap-4 text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400">
                  <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-600/10 bg-indigo-50 dark:bg-indigo-950">
                    {index + 1}
                  </span>
                  {step.name}
                  {index < steps.length - 1 && (
                    <ArrowRightIcon className="h-5 w-5 text-gray-400 lg:block hidden" />
                  )}
                </div>
                <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
