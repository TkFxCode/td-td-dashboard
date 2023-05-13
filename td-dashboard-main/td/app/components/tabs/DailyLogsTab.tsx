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
import DocumentList from '../demo/Documents';

const DailyLogsTab = () => {
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
    <div className="w-full h-full">
      <Card className="flex flex-col h-screen w-full ">
        <CardHeader>{user?.name}</CardHeader>
        <CardContent>
          DailyLogs
          <DocumentList />
        </CardContent>
        <CardFooter>DailyLogs</CardFooter>
      </Card>
    </div>
  );
};

export default DailyLogsTab;
