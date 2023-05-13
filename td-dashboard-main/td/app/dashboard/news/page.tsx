'use client';
import React from 'react';
import { useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import ToggleSidebar from '@/app/components/reusable/ToggleSidebar';

const News = () => {
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
      <div>News</div>
    </DashboardLayout>
  );
};

export default News;
