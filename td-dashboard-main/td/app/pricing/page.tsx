'use client';
import React from 'react';
import { Download, ExternalLink, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const plans = [
  {
    title: 'Free Trial',
    subtitle: '1 Week',
    price: '0',
    features: [
      'Trading Dashboard',
      'Daily Journal',
      'Notion-like Pages',
      'Real-time Updates',
      'Habit & Goal Tracker',
      'ChatGPT Integration',
    ],
    buttonText: 'Start Free Trial',
    buttonLink: '#',
    trial: true,
  },
  {
    title: 'Pro',
    subtitle: 'Professional Access',
    price: '8',
    priceAnnually: '76.80',
    features: [
      'Trading Dashboard',
      'Daily Journal',
      'Notion-like Pages',
      'Real-time Updates',
      'Habit & Goal Tracker',
      'ChatGPT Integration',
    ],
    buttonText: 'Subscribe Now',
    buttonLink: '#',
  },
  {
    title: 'Pro+',
    subtitle: 'Advanced Access',
    price: '17',
    priceAnnually: '163.20',
    features: [
      'Trading Dashboard',
      'Daily Journal',
      'Notion-like Pages',
      'Real-time Updates',
      'Habit & Goal Tracker',
      'ChatGPT Integration',
    ],
    buttonText: 'Subscribe Now',
    buttonLink: '#',
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="text-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-2">
          Pricing
        </h1>
        <p className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Choose the best plan for your trading journey
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto px-4">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className="rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-muted-foreground transition-all duration-200"
          >
            <div className="p-8">
              <h2 className="text-2xl font-semibold">{plan.title}</h2>
              <p className="text-xl mt-2 ">{plan.subtitle}</p>
              <div className="mt-6 text-5xl font-bold">
                ${plan.price}
                <span className="text-2xl font-normal">/mo</span>
              </div>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check size={16} className="text-green-500" />
                    <span className="ml-2 ">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full hover:scale-110 transition-all duration-200"
                onClick={() => alert(`Subscribing to ${plan.title}`)}
              >
                {plan.buttonText}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
