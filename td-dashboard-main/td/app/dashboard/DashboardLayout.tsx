'use client';
import React from 'react';
import Sidebar from '@/app/dashboard/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebarOpen,
}) => {
  return (
    <div className="flex flex-col ">
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } transition-all duration-300 ease-in-out overflow-hidden bg-card`}
        >
          <Sidebar />
        </aside>
        <main className="flex-1 p-4 overflow-y-auto w-full">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
