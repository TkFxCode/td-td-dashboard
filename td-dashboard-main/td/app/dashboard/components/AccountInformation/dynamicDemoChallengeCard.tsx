import React from 'react';
import { useState, useEffect } from 'react';
import { Progress as PositiveProgress } from '@/app/components/ui/progress';
import { NegativeProgress } from './NegativeProgress';
import { Badge } from '@/app/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { IoCheckmarkDoneSharp, IoWarningOutline } from 'react-icons/io5';
import { Label } from '@/app/components/ui/label';
import { IoIosClock } from 'react-icons/io';
import Moment from 'react-moment';
import { listTradeHistory } from '@/app/appwrite/services/tradingAccountService';
import { useUser } from '@/app/appwrite/useUser';

interface DynamicDemoChallengeCardProps {
  tradingAccountNumber: string;
  startBalance: number;
  apiKey: string;
  goalBalance: number;
  violationBalance: number;
  startDate: Date;
  endDate: Date;
}
interface Trade {
  profit: number;
}
const DynamicDemoChallengeCard: React.FC<DynamicDemoChallengeCardProps> = ({
  tradingAccountNumber,
  startBalance,
  apiKey,
  goalBalance,
  violationBalance,
  startDate,
  endDate,
}) => {
  const { user } = useUser();
  const [currentBalance, setCurrentBalance] = useState(startBalance);

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
        (sum: number, trade: Trade) => sum + trade.profit,
        startingBalance
      );
      return currentBalance;
    };

    const fetchBalance = async () => {
      const balance = await calculateCurrentBalance(apiKey, startBalance);
      setCurrentBalance(balance);
    };

    fetchBalance();
  }, [apiKey, user.$id, startBalance]);

  const calculateProgress = (current: number, start: number, end: number) => {
    const total = end - start;
    const progress = Math.max(0, Math.min(current - start, total));
    return (progress / total) * 100;
  };

  const progress = calculateProgress(currentBalance, startBalance, goalBalance);

  const isEndDatePast = new Date() > new Date(endDate);

  const status =
    (isEndDatePast && currentBalance < goalBalance) ||
    currentBalance <= violationBalance
      ? 'Unfortunately you have violated the rules on your account'
      : currentBalance >= goalBalance
      ? 'Congratulations you have passed the challenge objectives'
      : '';

  const renderStatus = () => {
    if (status) {
      if (status.includes('Congratulations')) {
        return (
          <Alert className="mt-4" variant="default">
            <IoCheckmarkDoneSharp className="h-4 w-4" />
            <AlertTitle>Congratulations!</AlertTitle>
            <AlertDescription>
              You have passed the challenge objectives.
            </AlertDescription>
          </Alert>
        );
      } else if (status.includes('Unfortunately')) {
        return (
          <Alert className="mt-4" variant="destructive">
            <IoWarningOutline className="h-4 w-4" />
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Unfortunately, you have violated the rules on your account.
            </AlertDescription>
          </Alert>
        );
      }
    }
    return null;
  };
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
            <Label htmlFor="progress" className="font-medium ">
              Progress
            </Label>

            <div className="flex items-center space-x-2">
              <IoIosClock size={24} />
              <div>
                Due{' '}
                <Label htmlFor="duedate" className="font-medium ">
                  <Moment fromNow date={endDate} />
                </Label>
              </div>
            </div>
          </div>
          {progress < 0 ? (
            <NegativeProgress
              value={Math.abs(progress)}
              className="w-full h-5  rounded-full mt-2"
            />
          ) : (
            <PositiveProgress
              value={progress}
              className="w-full h-5  rounded-full mt-2"
            />
          )}
          <div className="flex justify-between text-xs mt-2">
            <Badge variant="outline">Start: ${startBalance.toFixed(2)}</Badge>
            <Badge variant="outline">
              Current: ${currentBalance.toFixed(2)}
            </Badge>
            <Badge variant="outline">Goal: ${goalBalance.toFixed(2)}</Badge>
          </div>

          <div className="flex justify-between space-x-4 mt-4">
            <div>
              <Badge>
                Start Date : <Moment format="YYYY-MM-DD" date={startDate} />
              </Badge>
            </div>
            <div>
              <Badge variant="destructive">
                Due Date : {` `}
                <Moment format="YYYY-MM-DD" date={endDate} />
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>{renderStatus()}</CardFooter>
      </Card>
    </>
  );
};

export default DynamicDemoChallengeCard;
