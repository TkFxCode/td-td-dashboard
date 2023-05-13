// Dashboard.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Users,
  Mail,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { useUser } from '@/app/appwrite/useUser';
import withAuth from '@/app/middleware/withAuth';
import DashboardLayout from '@/app/dashboard/DashboardLayout';
import ToggleSidebar from '@/app/components/reusable/ToggleSidebar';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components/ui/tabs';
import LoadingScreen from '../components/loading/LoadingScreen';
const HomeTab = React.lazy(() => import('@/app/components/tabs/HomeTab'));
const TasksTab = React.lazy(() => import('@/app/components/tabs/TasksTab'));
const GoalsTab = React.lazy(() => import('@/app/components/tabs/GoalsTab'));
const CalendarTab = React.lazy(
  () => import('@/app/components/tabs/CalendarTab')
);
const NewsTab = React.lazy(() => import('@/app/components/tabs/NewsTab'));
const DailyLogsTab = React.lazy(
  () => import('@/app/components/tabs/DailyLogsTab')
);
const MarketWhisperer = React.lazy(
  () => import('@/app/components/tabs/MarketWhispererTab')
);

function Dashboard() {
  const { user, logout, getUserDocument } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const document = await getUserDocument(user.$id);
        setUserData(document);
      }
    };

    fetchData();
  }, [user, getUserDocument]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <DashboardLayout sidebarOpen={sidebarOpen}>
      <div className="mb-4 flex flex-col space-y-4 lg:space-y-0 lg:flex-row ">
        <Tabs defaultValue="tradingOverview" className=" w-full">
          <TabsList className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2  min-h-[350px] lg:min-h-0">
            <ToggleSidebar
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
            />
            <TabsTrigger value="tradingOverview" className="w-full lg:w-auto ">
              Trading Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="w-full lg:w-auto ">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="goals" className="w-full lg:w-auto ">
              Goals
            </TabsTrigger>
            <TabsTrigger value="calendar" className="w-full lg:w-auto ">
              Calendar
            </TabsTrigger>
            <TabsTrigger value="dailyLogs" className="w-full lg:w-auto ">
              Daily Logs
            </TabsTrigger>
            <TabsTrigger value="news" className="w-full lg:w-auto ">
              News
            </TabsTrigger>
            <TabsTrigger value="marketwhisperer" className="w-full lg:w-auto ">
              MarketWhisperer
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
          <TabsContent value="goals" className="space-y-4 w-full">
            <React.Suspense
              fallback={
                <div>
                  <LoadingScreen />
                </div>
              }
            >
              <GoalsTab />
            </React.Suspense>
          </TabsContent>
          <TabsContent value="calendar" className="space-y-4 w-full">
            <React.Suspense
              fallback={
                <div>
                  <LoadingScreen />
                </div>
              }
            >
              <CalendarTab />
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
          <TabsContent value="marketwhisperer" className="space-y-4 w-full">
            <React.Suspense
              fallback={
                <div>
                  <LoadingScreen />
                </div>
              }
            >
              <MarketWhisperer />
            </React.Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(Dashboard);
