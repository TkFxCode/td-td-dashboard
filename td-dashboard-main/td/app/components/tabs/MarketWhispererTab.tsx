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
import GPTQueryForm from '../demo/GPTQueryForm';
import TextInputForm from '../demo/TextInputForm';

const MarketWhispererTab = () => {
  const { user, logout, getUserDocument } = useUser();
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
    <div className="flex flex-col justify-center gap-6 mt-10 md:flex-row md:justify-center md:gap-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h3 className=" text-2xl font-semibold tracking-tight text-center m-5">
            MarketWhisperer Data Input
          </h3>
        </CardHeader>
        <CardContent>
          <TextInputForm />
        </CardContent>
      </Card>
      <Card className="w-full max-w-md">
        <CardHeader>
          <h3 className=" text-2xl font-semibold tracking-tight text-center m-5">
            MarketWhisperer Query Input
          </h3>
        </CardHeader>
        <CardContent>
          <GPTQueryForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketWhispererTab;
