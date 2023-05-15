import React from 'react';
import {
  Home,
  FileText,
  ShoppingCart,
  Star,
  Briefcase,
  Clock,
  Users,
  BookOpen,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import TeamSwitcher from '@/app/dashboard/components/teamSwitcher';

const Sidebar = () => {
  interface SidebarButtonProps {
    icon: JSX.Element;
    label: string;
    href: string;
  }

  const SidebarButton: React.FC<SidebarButtonProps> = ({
    icon,
    label,
    href,
  }) => {
    return (
      <Link
        href={href}
        className="w-full inline-flex items-center justify-start bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 cursor-pointer px-3 py-2 rounded-md"
      >
        <span className="mr-2">{icon}</span>
        {label}
      </Link>
    );
  };

  return (
    <nav className="p-4 h-[850px]">
      <ul className="flex flex-col space-y-4">
        <li>
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Your Pojects and Teams
          </h2>
          <TeamSwitcher />
        </li>
        <li>
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Navigation
          </h2>
        </li>
        <li>
          <SidebarButton icon={<Home />} label="Home" href="/dashboard" />
        </li>
        <li>
          <SidebarButton
            icon={<FileText />}
            label="News Feed"
            href="/dashboard/news"
          />
        </li>
        <li>
          <SidebarButton
            icon={<Users />}
            label="Funded Accounts"
            href="/dashboard/fundedAccounts"
          />
        </li>
        <li>
          <SidebarButton
            icon={<BookOpen />}
            label="Daily Journal"
            href="/dashboard/daily-journal"
          />
        </li>
        <li>
          <SidebarButton
            icon={<Clock />}
            label="Trade History"
            href="/dashboard/trade-history"
          />
        </li>
        <li>
          <SidebarButton
            icon={<Mail />}
            label="Market Overview"
            href="/dashboard/market"
          />
        </li>
        <li>
          <SidebarButton
            icon={<ShoppingCart />}
            label="Trade"
            href="/dashboard/trade"
          />
        </li>
        <li>
          <SidebarButton
            icon={<Star />}
            label="Watchlist"
            href="/dashboard/watchlist"
          />
        </li>
        <li>
          <SidebarButton
            icon={<Briefcase />}
            label="Portfolio"
            href="/dashboard/portfolio"
          />
        </li>
        <li>
          <SidebarButton
            icon={<Clock />}
            label="Order History"
            href="/dashboard/history"
          />
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
