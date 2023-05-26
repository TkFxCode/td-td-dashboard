import { CreditCard, LogOut, PlusCircle, Settings, User } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/avatar';
import { Button, buttonVariants } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { useUser } from '@/app/appwrite/useUser';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function UserProfile() {
  const router = useRouter();
  const { user, logout, getUserDocument } = useUser();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const document = await getUserDocument(user.$id);
        setUserData(document);
      }
    };

    fetchData();
  }, [user, getUserDocument]);
  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/07.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/dashboard/profile" className="w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </div>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/dashboard/billing" className="w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </div>
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/dashboard/settings" className="w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </div>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/dashboard/new-team" className="w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>New Team</span>
                </div>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button
            onClick={handleSignOut}
            className={`${buttonVariants({ variant: 'ghost' })} w-full`}
          >
            <div className="w-full flex flex-row items-center justify-between">
              <div className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="text-center">Sign Out</span>
              </div>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </div>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
