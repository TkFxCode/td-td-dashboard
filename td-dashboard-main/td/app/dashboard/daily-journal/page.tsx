'use client';
import React, { useState, useEffect } from 'react';
import ToggleSidebar from '@/app/components/reusable/ToggleSidebar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import LoadingScreen from '@/app/components/loading/LoadingScreen';
import { Card } from '@/app/components/ui/card';

const UserMDXDocuments = React.lazy(
  () => import('./components/UserMDXDocuments')
);
const TeamSwitcher = React.lazy(() => import('../components/teamSwitcher'));
const DocumentCard = React.lazy(() => import('../components/DocumentCard'));
const DemoTeamMembers = React.lazy(
  () => import('@/app/components/demo/teamMembers')
);
const DemoShareDocument = React.lazy(
  () => import('@/app/components/demo/ShareDocument')
);
const DemoReportAnIssue = React.lazy(
  () => import('@/app/components/demo/reportIssue')
);
const DemoPaymentMethod = React.lazy(
  () => import('@/app/components/demo/paymentMethod')
);

const DailyJournal = () => {
  return (
    <div className="mb-4 flex flex-col space-y-4 lg:space-y-0 lg:flex-row ">
      <Tabs defaultValue="userdocuments" className=" w-full">
        <TabsList className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 h-auto max-h-[350px] lg:min-h-0">
          <TabsTrigger value="userdocuments" className="w-full lg:w-auto ">
            User Documents
          </TabsTrigger>
          <TabsTrigger value="usersharedocuments" className="w-full lg:w-auto ">
            User Shared Documents
          </TabsTrigger>
          <TabsTrigger value="dailyjournaltrack" className="w-full lg:w-auto ">
            Daily Journal Track
          </TabsTrigger>
          <TabsTrigger value="calendar" className="w-full lg:w-auto ">
            Calendar
          </TabsTrigger>
          <TabsTrigger value="dailyLogs" className="w-full lg:w-auto ">
            Daily Logs
          </TabsTrigger>
          <TabsTrigger value="habittracker" className="w-full lg:w-auto ">
            Habit Tracker
          </TabsTrigger>
        </TabsList>
        <TabsContent value="userdocuments" className="space-y-4 w-full">
          <React.Suspense
            fallback={
              <div>
                <LoadingScreen />
              </div>
            }
          >
            <UserMDXDocuments />
          </React.Suspense>
        </TabsContent>
        <TabsContent value="usersharedocuments" className="space-y-4 w-full">
          <React.Suspense
            fallback={
              <div>
                <LoadingScreen />
              </div>
            }
          >
            User Shared Documents
            <DocumentCard />
          </React.Suspense>
        </TabsContent>
        <TabsContent value="dailyjournaltrack" className="space-y-4 w-full">
          <React.Suspense
            fallback={
              <div>
                <LoadingScreen />
              </div>
            }
          >
            <DemoTeamMembers />
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
            <DemoShareDocument />
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
            <DemoReportAnIssue />
          </React.Suspense>
        </TabsContent>
        <TabsContent value="habittracker" className="space-y-4 w-full">
          <React.Suspense
            fallback={
              <div>
                <LoadingScreen />
              </div>
            }
          >
            <DemoPaymentMethod />
          </React.Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyJournal;
