'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from './components/ui/button';
import { features } from '@/app/data/features';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from './appwrite/useUser';
import LoadingScreen from './components/loading/LoadingScreen';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [loadings, setLoadings] = useState(false); // Add loading state

  useEffect(() => {
    setLoadings(true); // Set loading to true when starting sign up process
    if (!loading && user) {
      router.push('/dashboard');
    }
    setLoadings(false); // Set loading to false when sign up process fails
  }, [loading, user, router]);

  if (loadings) {
    <LoadingScreen />;
  }

  return (
    <section className="container h-auto mx-auto px-4 sm:px-6 lg:px-8 py-16 text-foreground">
      <div className="max-w-[100%] mx-auto flex flex-col items-center gap-6">
        <h1 className="scroll-m-20 text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-center">
          Beautifully designed trading <br className="hidden sm:inline" />
          dashboard built by traders for traders.
        </h1>
        <p className="max-w-[700px] text-lg sm:text-xl leading-7 text-center">
          Accessible and customizable dashboard to help you make the most of
          your trading strategy.
        </p>
        <Link href="/signup">
          <Button className="bg-primary-foreground dark:bg-secondary-foreground text-primary dark:text-secondary font-semibold px-8 py-3 rounded-md shadow-md hover:bg-secondary hover:dark:bg-gray-400 hover:text-secondary-foreground transition-colors">
            Get Started
          </Button>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center gap-4 p-4 border-2 border-transparent rounded-lg transition-all duration-300 hover:border-primary"
            >
              <feature.icon className="w-16 h-16 mb-4 transition-transform duration-300 ease-in-out hover:scale-125 hover:-rotate-12" />
              <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
                {feature.title}
              </h2>
              <p className="text-center leading-7 [&:not(:first-child)]:mt-6">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
