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
        </TabsList>
        <TabsContent value="myProfile" className="space-y-4 w-full">
          <ProfileForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettings;
