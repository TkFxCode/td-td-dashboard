'use client';
import React from 'react';
import { useUser } from '@/app/appwrite/useUser';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/app/components/ui/card';
import {
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Users,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Overview } from '@/app/dashboard/components/AccountInformation/overviewChart';
import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';
import AccountSwitcher from '@/app/dashboard/components/AccountSwitcher';
import LoadingScreen from '../loading/LoadingScreen';

const HomeTab = () => {
  const { user, getUserDocument } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (user) {
        const document = await getUserDocument(user.$id);
        setUserData(document);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [user, getUserDocument]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-auto">
      <AccountSwitcher />
    </div>
  );
};

export default HomeTab;
