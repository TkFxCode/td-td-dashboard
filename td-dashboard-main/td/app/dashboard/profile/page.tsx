'use client';
import React from 'react';
import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { ProfileForm } from './components/form-test';

const AccountSettings = () => {
  return (
    <div className="mb-4 flex flex-col space-y-4 lg:space-y-0 lg:flex-row ">
      <Tabs defaultValue="myProfile" className="w-full">
        <TabsList className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2  min-h-[350px] lg:min-h-0">
          <TabsTrigger value="myProfile" className="w-full lg:w-auto ">
            My Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="w-full lg:w-auto ">
            Security
          </TabsTrigger>
          <TabsTrigger value="tradeFloors" className="w-full lg:w-auto ">
            Trade Floors
          </TabsTrigger>
          <TabsTrigger value="notifications" className="w-full lg:w-auto ">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="w-full lg:w-auto ">
            Billing
          </TabsTrigger>
          <TabsTrigger value="exportData" className="w-full lg:w-auto ">
            Export Data
          </TabsTrigger>
        </TabsList>
        <TabsContent value="myProfile" className="space-y-4 w-full">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="security" className="space-y-4 w-full">
          security
        </TabsContent>
        <TabsContent value="tradeFloors" className="space-y-4 w-full">
          tradeFloors
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4 w-full">
          notifications
        </TabsContent>
        <TabsContent value="billing" className="space-y-4 w-full">
          Billing
        </TabsContent>
        <TabsContent value="exportData" className="space-y-4 w-full">
          ExportData
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettings;
