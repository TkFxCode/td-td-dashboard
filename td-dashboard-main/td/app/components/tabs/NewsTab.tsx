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
import NewsComponent from '../demo/news/NewsComponent';
import DaysOfWeekNewsComponent from '../demo/news/DailyHighImpact';
import ParentComponent from '../demo/news/parentComponent';

const NewsTab = () => {
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
    <div className="w-full ">
      <Card className="flex flex-col  w-full ">
        <CardHeader>
          <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            News Dashboard
          </h1>
        </CardHeader>
        <CardContent>
          {/* <GPTQueryForm /> */}
          {/* <NewsComponent />
          <DaysOfWeekNewsComponent /> */}
          <ParentComponent />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsTab;
