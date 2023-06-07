'use client';
import React, { useState } from 'react';
import { Mail, User as UserIcon, Menu } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import { ThemeToggle } from '../themeToggle';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { useUser } from '@/app/appwrite/useUser';
import { UserProfile } from '@/app/dashboard/components/userProfile';

const Navbar = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useUser();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const loggedInNavbar = (
    <ul className="flex justify-between items-center space-x-4">
      <li>
        <a href="/dashboard" className={buttonVariants({ variant: 'ghost' })}>
          Dashboard
        </a>
      </li>
      {/* <li>
        <button
          onClick={handleSignOut}
          className={buttonVariants({ variant: 'ghost' })}
        >
          Sign Out
        </button>
      </li> */}
      <li>
        {/* <a href="/profile" className={buttonVariants({ variant: 'ghost' })}>
          Profile
        </a> */}
        <UserProfile />
      </li>
      <li>
        <ThemeToggle /> {/* Add the ThemeToggle component */}
      </li>
    </ul>
  );

  const loggedOutNavbar = (
    <ul className="flex justify-between items-center space-x-4">
      <li>
        <a href="/" className={buttonVariants({ variant: 'ghost' })}>
          Home
        </a>
      </li>
      <li>
        <a href="/about" className={buttonVariants({ variant: 'ghost' })}>
          About
        </a>
      </li>
      <li>
        <a href="/updates" className={buttonVariants({ variant: 'ghost' })}>
          Updates
        </a>
      </li>

      <li>
        <a
          href="/dashboard"
          className="flex items-center space-x-2 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
        >
          <Mail size={16} />
          <span>Dashboard</span>
        </a>
      </li>
      <li>
        <a
          href="/signup"
          className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
        >
          <UserIcon size={16} />
          <span>Sign Up</span>
        </a>
      </li>
      <li>
        <ThemeToggle /> {/* Add the ThemeToggle component */}
      </li>
    </ul>
  );

  const renderMobileMenuItems = () => {
    return (
      <>
        {user ? (
          <>
            <DropdownMenuItem
              onSelect={() => (window.location.href = '/dashboard')}
            >
              TheTradingDashboard
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleSignOut}>
              Sign Out
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => (window.location.href = '/profile')}
            >
              Profile
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onSelect={() => (window.location.href = '/')}>
              Home
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => (window.location.href = '/about')}
            >
              About
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => (window.location.href = '/updates')}
            >
              Updates
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => (window.location.href = '/pricing')}
            >
              Pricing
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => (window.location.href = '/dashboard')}
            >
              <Mail className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => (window.location.href = '/signup')}
            >
              Sign Up
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ThemeToggle fullWidth />
        </DropdownMenuItem>
      </>
    );
  };

  return (
    <header>
      <nav className="flex justify-between items-center py-4">
        <div className="mx-auto max-w-7xl  w-full px-4">
          <div className="flex justify-between items-center w-full">
            <div>
              <a href={user ? '/dashboard' : '/'} className="text-xl font-bold">
                TheTradingDashboard
              </a>
            </div>
            <div className="hidden lg:block">
              {user ? loggedInNavbar : loggedOutNavbar}
            </div>
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={toggleMobileMenu}
                    className="focus:outline-none"
                  >
                    <Menu size={35} />
                  </button>
                </DropdownMenuTrigger>
                {mobileMenuOpen && (
                  <DropdownMenuContent className="w-56">
                    {renderMobileMenuItems()}
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
