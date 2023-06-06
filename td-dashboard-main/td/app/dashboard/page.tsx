'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/appwrite/useUser';
import withAuth from '@/app/middleware/withAuth';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/app/components/ui/tabs';
import LoadingScreen from '../components/loading/LoadingScreen';
const BookmarksTab = React.lazy(
  () => import('@/app/components/tabs/BookmakrsTab')
);
const HomeTab = React.lazy(() => import('@/app/components/tabs/HomeTab'));
const TasksTab = React.lazy(() => import('@/app/components/tabs/TasksTab'));

const NewsTab = React.lazy(() => import('@/app/components/tabs/NewsTab'));
const DailyLogsTab = React.lazy(
  () => import('@/app/components/tabs/DailyLogsTab')
);

function Dashboard() {
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
    <div className="mb-4 flex flex-col space-y-4 lg:space-y-0 lg:flex-row ">
      <Tabs defaultValue="tradingOverview" className=" w-full">
        <TabsList className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2  min-h-[350px] lg:min-h-0">
          <TabsTrigger value="tradingOverview" className="w-full lg:w-auto ">
            Trading Overview
          </TabsTrigger>
          <TabsTrigger value="tasks" className="w-full lg:w-auto ">
            Tasks
          </TabsTrigger>

          <TabsTrigger value="dailyLogs" className="w-full lg:w-auto ">
            Daily Logs
          </TabsTrigger>
          <TabsTrigger value="news" className="w-full lg:w-auto ">
            News
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="w-full lg:w-auto ">
            Bookmarks
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tradingOverview" className="space-y-4 w-full">
          <React.Suspense
            fallback={
              <div>
                <LoadingScreen />
              </div>
            }
          >
            <HomeTab />
          </React.Suspense>
        </TabsContent>
        <TabsContent value="tasks" className="space-y-4 w-full">
          <React.Suspense
            fallback={
              <div>
                <LoadingScreen />
              </div>
            }
          >
            <TasksTab />
          </React.Suspense>
        </TabsContent>

        <TabsContent value="dailyLogs" className="space-y-4 w-full">
          <React.Suspense
            fallback={
              <div>
                <LoadingScreen />
              </div>
            }
          >
            <DailyLogsTab />
          </React.Suspense>
        </TabsContent>
        <TabsContent value="news" className="space-y-4 w-full">
          <React.Suspense
            fallback={
              <div>
                <LoadingScreen />
              </div>
            }
          >
            <NewsTab />
          </React.Suspense>
        </TabsContent>
        <TabsContent value="bookmarks" className="space-y-4 w-full">
          <React.Suspense
            fallback={
              <div>
                <LoadingScreen />
              </div>
            }
          >
            <BookmarksTab />
          </React.Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAuth(Dashboard);
