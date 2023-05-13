'use client';
import React from 'react';
import DashboardLayout from '../DashboardLayout';
import { useState } from 'react';
import ToggleSidebar from '@/app/components/reusable/ToggleSidebar';

const FundedAccounts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <DashboardLayout sidebarOpen={sidebarOpen}>
      <div className="mb-4">
        <ToggleSidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>
      <div>FundedAccounts</div>
    </DashboardLayout>
  );
};

export default FundedAccounts;
