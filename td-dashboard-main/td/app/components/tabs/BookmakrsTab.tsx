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
import DocumentList from '../demo/documents/Documents';
import BookmarkCreate from '../demo/bookmarks/BookmarkCreate';
import BookmarkViewer from '../demo/bookmarks/BookmarkViewer';

const BookmarksTab = () => {
  const { user, logout, getUserDocument } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [refresh, setRefresh] = useState(false);

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
          <BookmarkCreate setRefresh={setRefresh} />
        </CardContent>
        <CardFooter className="w-full">
          <BookmarkViewer refresh={refresh} userId={user.$id} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookmarksTab;
