'use client';

import {
  BarChart2,
  BookOpen,
  CheckSquare,
  MessageCircle,
  TrendingUp,
  Zap,
  Clock,
  Globe,
  Contact,
  Star,
} from 'lucide-react';
import { features } from '@/app/data/features';

const About = () => {
  return (
    <div className="min-h-screen bg-pattern py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-3/4 sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary shadow-lg transform sm:rounded-3xl"></div>
        <div className="relative border border-border px-4 py-10 bg-card shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-4xl font-bold mb-6 text-center">
            About Our Trading Dashboard
          </h1>
          <p className="text-lg mb-6">
            Our trading dashboard is designed to help you take control of your
            trading journey by providing you with comprehensive features and
            tools that cater to every aspect of your trading life. From tracking
            statistics to journaling, weve got you covered.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div>
                  {feature.icon === BarChart2 && (
                    <BarChart2 className="text-primary w-12 h-12 group-hover:scale-110 transition duration-200 ease-in-out" />
                  )}
                  {feature.icon === BookOpen && (
                    <BookOpen className="text-primary w-12 h-12 group-hover:scale-110 transition duration-200 ease-in-out" />
                  )}
                  {feature.icon === CheckSquare && (
                    <CheckSquare className="text-primary w-12 h-12 group-hover:scale-110 transition duration-200 ease-in-out" />
                  )}
                  {feature.icon === TrendingUp && (
                    <TrendingUp className="text-primary w-12 h-12 group-hover:scale-110 transition duration-200 ease-in-out" />
                  )}
                  {feature.icon === Zap && (
                    <Zap className="text-primary w-12 h-12 group-hover:scale-110 transition duration-200 ease-in-out" />
                  )}
                  {feature.icon === MessageCircle && (
                    <MessageCircle className="text-primary w-12 h-12 group-hover:scale-110 transition duration-200 ease-in-out" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-gray-400  transition duration-200 ease-in-out">
                    {feature.title}
                  </h3>
                  <p className="mt-2 group-hover:text-gray-400 transition duration-200 ease-in-out">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold mt-8 mb-4">Additional Benefits</h2>

          <p className="text-lg mt-6">
            We strive to provide an all-encompassing platform that enables you
            to make the most of your trading journey. Our trading dashboard is
            constantly evolving and improving to stay up-to-date with the latest
            trends and technologies in the industry. Start your journey with us
            and experience a new level of trading success.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
