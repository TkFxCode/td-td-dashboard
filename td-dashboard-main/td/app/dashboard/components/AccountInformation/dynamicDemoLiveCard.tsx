import React, { useState, useEffect } from 'react';
import { Progress as PositiveProgress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { IoIosClock } from 'react-icons/io';
import { AiFillAlert } from 'react-icons/ai';

import Moment from 'react-moment';
import { Archive, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Label } from '@/app/components/ui/label';

interface DynamicLiveAccountCardProps {
  tradingAccountNumber: string;
  startBalance: number;
  currentBalance: number;
  startDate: string;
}

const DynamicLiveAccountCard: React.FC<DynamicLiveAccountCardProps> = ({
  tradingAccountNumber,
  startBalance,
  currentBalance,
  startDate,
}) => {
  const [nextPayoutDate, setNextPayoutDate] = useState<string>(''); // Hold the next payout date
  const [nextPayoutAmount, setNextPayoutAmount] = useState<number>(0); // Hold the next payout amount

  const calculatePayout = (start: number, current: number) => {
    const profit = current - start;
    return profit > 0 ? profit * 0.8 : 0; // 80% of the profit
  };

  const calculateNextPayoutDate = (date: string) => {
    // calculate 14 days from the start date
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() + 14);
    return startDate.toISOString();
  };

  useEffect(() => {
    setNextPayoutAmount(calculatePayout(startBalance, currentBalance));
    setNextPayoutDate(calculateNextPayoutDate(startDate));
  }, [startBalance, currentBalance, startDate]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center">
              <div>Trading Account Number: {tradingAccountNumber}</div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Archive className="mr-2 h-4 w-4" />
                      <span>Archive Account</span>
                    </DropdownMenuItem>{' '}
                    <DropdownMenuItem>
                      <Archive className="mr-2 h-4 w-4" />
                      <span>Set Notification for Payout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm ">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Label htmlFor="nextpayout" className="font-medium">
                Next Payout: ${nextPayoutAmount.toFixed(2)}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <IoIosClock size={24} />
              <div>
                Next Payout Date{' '}
                <Label htmlFor="nextpayoutdate" className="font-medium ">
                  <Moment format="YYYY-MM-DD" date={nextPayoutDate} />
                </Label>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs mt-2">
            <Badge variant="outline">Start: ${startBalance.toFixed(2)}</Badge>
            <Badge variant="outline">
              Current: ${currentBalance.toFixed(2)}
            </Badge>
          </div>

          <div className="flex justify-between space-x-4 mt-4">
            <div>
              <Badge>
                Start Date : <Moment format="YYYY-MM-DD" date={startDate} />
              </Badge>
            </div>
            <div>
              <Badge variant="destructive">
                Next Payout Date : {` `}
                <Moment format="YYYY-MM-DD" date={nextPayoutDate} />
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="transition-transform duration-200 ease-in-out transform hover:scale-105">
          <Alert>
            <AiFillAlert className="inline-block mr-2" />
            <AlertTitle>Your Next Payout</AlertTitle>
            <AlertDescription>
              Your next payout amount is:{' '}
              <Badge className="bg-green-500 ml-2">
                ${nextPayoutAmount.toFixed(2)}
              </Badge>
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>
    </>
  );
};

export default DynamicLiveAccountCard;
