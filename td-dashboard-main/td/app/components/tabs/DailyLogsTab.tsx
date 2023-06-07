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
import BookmarksTab from '../demo/BookmarkCreate';
import BookmarkViewer from '../demo/BookmarkViewer';

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
      <Card className="flex flex-col h-full w-full ">
        <CardHeader>
          <CardTitle>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Daily Trading Logs
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentList />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default DailyLogsTab;
