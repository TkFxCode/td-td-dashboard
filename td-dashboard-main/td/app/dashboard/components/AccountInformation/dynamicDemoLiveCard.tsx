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
import { useUser } from '@/app/appwrite/useUser';

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
import { listTradeHistory } from '@/app/appwrite/services/tradingAccountService';

interface DynamicLiveAccountCardProps {
  tradingAccountNumber: string;
  startBalance: number;
  apiKey: string;
  startDate: Date;
  endDate: Date;
}

const DynamicLiveAccountCard: React.FC<DynamicLiveAccountCardProps> = ({
  tradingAccountNumber,
  startBalance,
  startDate,
  apiKey,
  endDate,
}) => {
  const { user } = useUser();
  const [currentBalance, setCurrentBalance] = useState(startBalance);
  const [nextPayoutDate, setNextPayoutDate] = useState<string>(''); 
  const [nextPayoutAmount, setNextPayoutAmount] = useState<number>(0); 

  const calculatePayout = (start: number, current: number) => {
    const profit = current - start;
    return profit > 0 ? profit * 0.8 : 0; 
  };

  useEffect(() => {
    const calculateCurrentBalance = async (
      apiKey: string,
      startingBalance: number
    ) => {
      let finalApiKey = '';
      if (apiKey.includes('/')) {
        let splitUrl = apiKey.split('/');
        finalApiKey =
          splitUrl.length > 0 ? (splitUrl.pop() as string) : finalApiKey;
      } else {
        finalApiKey = apiKey;
      }

      const response = await listTradeHistory(user.$id, finalApiKey);
      let trades = [];
      if (response?.documents && response.documents.length > 0) {
        const tradingHistoryJson = JSON.parse(
          response?.documents[0].TradingHistory
        );
        trades = tradingHistoryJson.trades;
      }

      
      const currentBalance = trades.reduce(
        (sum: number, trade: { profit: number }) => sum + trade.profit,
        startingBalance
      );

      return currentBalance;
    };

    const fetchBalance = async () => {
      const balance = await calculateCurrentBalance(apiKey, startBalance);
      setCurrentBalance(balance);
      setNextPayoutAmount(calculatePayout(startBalance, balance));
    };

    fetchBalance();
  }, [apiKey, user.$id, startBalance, endDate]);

  return (
    <>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center">
              <div>Trading Account Number: {tradingAccountNumber}</div>
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
                  <Moment fromNow date={nextPayoutDate} />
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
