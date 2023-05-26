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
import { Overview } from '@/app/components/demo/overviewChart';
import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';
import AccountSwitcher from '@/app/dashboard/components/AccountSwitcher';

const HomeTab = () => {
  const { user, getUserDocument } = useUser();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const document = await getUserDocument(user.$id);
        setUserData(document);
      }
    };

    fetchData();
  }, [user, getUserDocument]);

  return (
    <div className="w-full h-auto">
      <AccountSwitcher />
    </div>
  );
};

export default HomeTab;
