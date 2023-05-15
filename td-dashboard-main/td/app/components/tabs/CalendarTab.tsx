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
import BookmarksTab from '../demo/BookmarksTab';

const CalendarTab = () => {
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
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Bookmark Manager
          </h1>
        </CardHeader>
        <CardContent>
          <BookmarksTab />
        </CardContent>
        <CardFooter>Calendar</CardFooter>
      </Card>
    </div>
  );
};

export default CalendarTab;
