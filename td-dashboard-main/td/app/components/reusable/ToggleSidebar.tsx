// ToggleSidebar.tsx
import React from 'react';
import { Button } from '@/app/components/ui/button';
import { Mail } from 'lucide-react';

interface ToggleSidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const ToggleSidebar: React.FC<ToggleSidebarProps> = ({
  sidebarOpen,
  toggleSidebar,
}) => {
  return (
    <Button
      onClick={toggleSidebar}
      className="bg-accent text-accent-foreground hover:bg-accent-dark transition-colors duration-200"
    >
      <Mail className="mr-2 h-4 w-4" />
      {sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
    </Button>
  );
};

export default ToggleSidebar;
