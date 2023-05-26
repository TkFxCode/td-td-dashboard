import React from 'react';
import { useUser } from '@/app/appwrite/useUser';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/app/components/ui/card';
import {
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Users,
} from 'lucide-react';
import { Overview } from '@/app/components/demo/overviewChart';
interface SelectedAccountType {
  label: string;
  // Add other properties as needed
}
const AccountInformation = ({
  selectedAccount,
}: {
  selectedAccount: SelectedAccountType;
}) => {
  const { user, getUserDocument } = useUser();
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
  console.log(selectedAccount);
  return (
    <Card className="flex flex-col  w-full ">
      <CardHeader>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:bg-gray-200 dark:hover:bg-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="hover:bg-gray-200 dark:hover:bg-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscriptions
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="hover:bg-gray-200 dark:hover:bg-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="hover:bg-gray-200 dark:hover:bg-slate-700 ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>
      </CardHeader>
      <CardContent>
        {' '}
        <h1 className="text-foreground text-center">
          Welcome to your trading dashboard, {user?.name}!
        </h1>
        <h2 className="text-foreground text-center">
          You have selected account: {selectedAccount.label}
        </h2>
        <p className="text-foreground text-center">
          Your email address is: {user?.email}
        </p>
        <h2 className="text-foreground text-center">
          Only logged in users can view this Dashboard {userData?.username}
        </h2>
        <h3 className="text-foreground mt-6 text-center">Latest Trades</h3>
        <p className="text-foreground text-center">
          ETH/USD: $3,500 | 0.25 ETH | 12:35:20 PM
        </p>
        <p className="text-foreground text-center">
          ETH/USD: $3,500 | 0.25 ETH | 12:35:20 PM
        </p>
        <p className="text-foreground text-center">
          ETH/USD: $3,500 | 0.25 ETH | 12:35:20 PM
        </p>
        <p className="text-foreground text-center"></p>
      </CardContent>
      <CardFooter></CardFooter>
      <Card>
        <CardHeader>
          <h2 className="text-3xl font-bold tracking-tight">Chart</h2>
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap">
          <div className="w-full md:w-1/2">
            <Card>
              <CardTitle className="m-5 text-center ">Chart 1</CardTitle>
              <CardContent>
                <Overview />
              </CardContent>
            </Card>
          </div>
          <div className="w-full md:w-1/2">
            <Card>
              <CardTitle className="m-5 text-center ">Chart 2</CardTitle>
              <CardContent>
                <Overview />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </Card>
  );
};

export default AccountInformation;
