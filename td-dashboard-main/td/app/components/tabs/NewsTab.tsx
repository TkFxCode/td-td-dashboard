'use client';
import React from 'react';
import { useUser } from '@/app/appwrite/useUser';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
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
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            News Dashboard
          </h1>
        </CardHeader>
        <CardContent>
          <ParentComponent />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsTab;
