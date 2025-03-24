
import { Activity, Users, Globe2, Zap } from "lucide-react";

const WhatWeOffer = () => {
  const features = [
    {
      name: 'Smart Matching',
      description: 'Our AI-powered matching system connects you with professionals who share your interests and goals.',
      icon: Zap,
    },
    {
      name: 'Global Network',
      description: 'Connect with professionals worldwide or focus on your local area with location-based matching.',
      icon: Globe2,
    },
    {
      name: 'Active Community',
      description: 'Join a vibrant community of professionals actively seeking meaningful connections.',
      icon: Users,
    },
    {
      name: 'Real-time Engagement',
      description: 'Stay engaged with instant messaging, video calls, and real-time notifications.',
      icon: Activity,
    },
  ];

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
            Professional Networking
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to grow your network
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Build meaningful professional relationships through our smart matching system and comprehensive networking tools.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default WhatWeOffer;
