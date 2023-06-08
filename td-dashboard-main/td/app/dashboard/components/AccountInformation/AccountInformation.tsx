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
import { cn } from '@/lib/utils';
import { Command, CommandItem, CommandList } from '@/app/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import {
  Activity,
  CreditCard,
  Banknote,
  Star,
  LineChart,
  ChevronsUpDown,
} from 'lucide-react';
import { Overview } from '@/app/dashboard/components/AccountInformation/overviewChart';
import { Trade, columns } from '../tables/columns';
import { DataTable } from '../tables/data-table';
import { listTradeHistory } from '@/app/appwrite/services/tradingAccountService';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/app/components/ui/hover-card';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import AccountDetails from './AccountSummary';
import DayProfitView from './dayProfitView';
import WeekProfitView from './weekProfitView';
import { Badge } from '@/app/components/ui/badge';

interface SelectedAccountType {
  label: string;
  value: string;
  accountDetails: {
    propFirm: string;
    shareURL: string;
    accountSize: string;
    accountPhase: string;
    accountNumber: string;
    startDate: Date;
    endDate: Date;
  }[];
}
interface ResponseType {
  documents?: {
    TradingHistory: string;
  }[];
}

interface SelectedContent {
  label: string;
  component: React.ReactNode | null;
}
const AccountInformation = ({
  selectedAccount,
}: {
  selectedAccount: SelectedAccountType;
}) => {
  const { user, getUserDocument } = useUser();
  const [userData, setUserData] = useState<any>(null);

  const [selectedContent, setSelectedContent] = React.useState<SelectedContent>(
    {
      label: 'Select content',
      component: null,
    }
  );

  const [open, setOpen] = React.useState(false);

  interface TradeHistory {
    apiKey: string;
    trades: any[];
    accountDetails: {
      propFirm: string;
      accountSize: string;
      accountPhase: string;
      accountNumber: string;
    };
  }
  interface DataItem {
    day: string;
    profit: number;
  }

  const [tradeHistories, setTradeHistories] = useState<TradeHistory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const document = await getUserDocument(user.$id);
        setUserData(document);
      }
    };

    const fetchTradeHistories = async () => {
      if (selectedAccount.accountDetails) {
        const allHistories = await Promise.all(
          selectedAccount.accountDetails.map(async (account) => {
            let apiKey = '';

            if (account.shareURL.includes('/')) {
              let splitUrl = account.shareURL.split('/');
              apiKey =
                splitUrl.length > 0
                  ? (splitUrl.pop() as string)
                  : account.shareURL;
            } else {
              apiKey = account.shareURL;
            }

            const response = await listTradeHistory(user.$id, apiKey);

            let trades = [];
            if (response?.documents && response.documents.length > 0) {
              const tradingHistoryJson = JSON.parse(
                response?.documents[0].TradingHistory
              );
              trades = tradingHistoryJson.trades;
              console.log(tradingHistoryJson);
            }

            return { apiKey, trades, accountDetails: account };
          })
        );
        setTradeHistories(allHistories);
      }
    };

    if (selectedContent.component !== null) {
      setSelectedContent({
        label: selectedContent.label,
        component: <AccountDetails account={selectedAccount} />,
      });
    }

    fetchTradeHistories();
    fetchData();
  }, [user, getUserDocument, selectedAccount, selectedAccount.accountDetails]);
  // console.log(selectedAccount);
  // console.log(tradeHistory);
  const data = [
    {
      symbol: 'US100.cash',
      tradeType: 'DEAL_TYPE_SELL',
      volume: 1.75,
      entryPrice: 11943.7,
      exitPrice: 11949,
      commission: -0.2,
      swap: 0,
      profit: -9.479999999999999,
      partials: 2,
    },
  ];

  const calculateTotalProfitLoss = (tradeHistories: TradeHistory[]) => {
    let totalProfitLoss = 0;

    tradeHistories.forEach((tradeHistory) => {
      tradeHistory.trades.forEach((trade) => {
        totalProfitLoss += trade.profit;
      });
    });

    return totalProfitLoss.toFixed(2);
  };
  const totalProfitLoss = calculateTotalProfitLoss(tradeHistories);

  const calculateWinRate = (tradeHistories: TradeHistory[]) => {
    let totalTrades = 0;
    let winningTrades = 0;

    tradeHistories.forEach((tradeHistory) => {
      tradeHistory.trades.forEach((trade) => {
        totalTrades += 1;
        if (trade.profit > 0) {
          winningTrades += 1;
        }
      });
    });

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    return winRate.toFixed(2);
  };

  const calculateAverageProfitPerWinningTrade = (
    tradeHistories: TradeHistory[]
  ) => {
    let winningTradesCount = 0;
    let totalProfitFromWinningTrades = 0;

    tradeHistories.forEach((tradeHistory) => {
      tradeHistory.trades.forEach((trade) => {
        if (trade.profit > 0) {
          winningTradesCount += 1;
          totalProfitFromWinningTrades += trade.profit;
        }
      });
    });

    const averageProfitPerWinningTrade =
      winningTradesCount > 0
        ? (totalProfitFromWinningTrades / winningTradesCount).toFixed(2)
        : '0';

    return averageProfitPerWinningTrade;
  };

  const calculateAverageLossPerLosingTrade = (
    tradeHistories: TradeHistory[]
  ) => {
    let losingTradesCount = 0;
    let totalLossFromLosingTrades = 0;

    tradeHistories.forEach((tradeHistory) => {
      tradeHistory.trades.forEach((trade) => {
        if (trade.profit < 0) {
          losingTradesCount += 1;
          totalLossFromLosingTrades += Math.abs(trade.profit);
        }
      });
    });

    const averageLossPerLosingTrade =
      losingTradesCount > 0
        ? (totalLossFromLosingTrades / losingTradesCount).toFixed(2)
        : '0';

    return averageLossPerLosingTrade;
  };

  const calculateRiskToRewardRatio = (
    averageProfitPerWinningTrade: number,
    averageLossPerLosingTrade: number
  ) => {
    const riskToRewardRatio =
      averageLossPerLosingTrade > 0
        ? (averageProfitPerWinningTrade / averageLossPerLosingTrade).toFixed(2)
        : 'N/A';

    return riskToRewardRatio;
  };

  const averageProfitPerWinningTrade =
    calculateAverageProfitPerWinningTrade(tradeHistories);

  const averageLossPerLosingTrade =
    calculateAverageLossPerLosingTrade(tradeHistories);

  const riskToRewardRatio = calculateRiskToRewardRatio(
    parseFloat(averageProfitPerWinningTrade),
    parseFloat(averageLossPerLosingTrade)
  );
  const calculateWeeklyProfit = (tradeHistories: TradeHistory[]) => {
    const weeklyProfits: { [week: string]: number } = {};

    tradeHistories.forEach((tradeHistory) => {
      tradeHistory.trades.forEach((trade) => {
        const exitTime = new Date(trade.exitTime);
        const weekNumber = getWeekNumber(exitTime);

        if (!weeklyProfits[weekNumber]) {
          weeklyProfits[weekNumber] = 0;
        }
        weeklyProfits[weekNumber] += trade.profit;
      });
    });

    const result = Object.keys(weeklyProfits).map((weekNumber) => ({
      week: `Week ${weekNumber}`,
      profit: parseFloat(weeklyProfits[weekNumber].toFixed(2)),
    }));

    return result;
  };

  const getWeekNumber = (d: Date): number => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
    return weekNo;
  };

  const calculateProfitByDay = (tradeHistories: TradeHistory[]): DataItem[] => {
    const profitByDay: Record<string, number> = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    tradeHistories.forEach((tradeHistory) => {
      tradeHistory.trades.forEach((trade) => {
        const exitDate = new Date(trade.exitTime);
        const dayOfWeek = exitDate.getDay();
        const dayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
          dayOfWeek
        ];
        profitByDay[dayLabel] += trade.profit;
      });
    });

    return Object.entries(profitByDay)
      .map(([day, profit]) => ({
        day,
        profit: parseFloat(profit.toFixed(2)),
      }))
      .filter((item) => item.profit !== 0);
  };

  return (
    <Card className="flex flex-col  w-full ">
      <CardHeader>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:bg-gray-200 dark:hover:bg-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Profit/Loss
              </CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$ {totalProfitLoss}</div>
            </CardContent>
          </Card>
          <Card className="hover:bg-gray-200 dark:hover:bg-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {calculateWinRate(tradeHistories)} %
              </div>
            </CardContent>
          </Card>
          <Card className="hover:bg-gray-200 dark:hover:bg-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Profit Per Trade
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $ {averageProfitPerWinningTrade}
              </div>
            </CardContent>
          </Card>
          <Card className="hover:bg-gray-200 dark:hover:bg-slate-700 ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Risk to Reward
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{riskToRewardRatio} RR</div>
            </CardContent>
          </Card>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-5 justify-center">
          <div className="lg:col-span-1 max-h-[700px] max-w-[428px] mx-auto ">
            <WeekProfitView
              weeklyProfits={calculateWeeklyProfit(tradeHistories)}
            />
          </div>
          <div className="lg:col-span-1 max-h-[700px] max-w-[428px] mx-auto">
            <DayProfitView
              dailyProfits={calculateProfitByDay(tradeHistories)}
            />
          </div>

          <div className="sm:col-span-1 md:col-span-2 lg:col-span-2">
            <Card className=" h-full">
              <CardTitle className="m-5 text-center">
                All Accounts Summary
              </CardTitle>
              <CardContent className="h-full max-h-[610px]">
                <ScrollArea className="h-[500px] w-full lg:h-[580px]  rounded-md border ">
                  {/* Replacement for the PopoverTrigger */}

                  {/* Display content for 'All Accounts Summary' */}
                  <AccountDetails account={selectedAccount} />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="">
          <CardHeader>
            <CardTitle>
              <h3 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Account Summaries
              </h3>
            </CardTitle>
          </CardHeader>
          <CardContent className="m-0 p-0">
            <div>
              <div>
                <Card className="p-3 pt-5 md:min-h-full m-2">
                  <CardTitle>
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-center">
                      All Trade History
                    </h2>
                  </CardTitle>
                  <CardContent className="m-2 p-2">
                    <Tabs className="w-full">
                      <TabsList className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2  h-auto max-h-[250px] lg:min-h-0">
                        {[
                          ...new Set(
                            tradeHistories.map(
                              (history) => history.accountDetails.propFirm
                            )
                          ),
                        ].map((propFirm, index) => (
                          <TabsTrigger key={index} value={propFirm}>
                            {propFirm}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {[
                        ...new Set(
                          tradeHistories.map(
                            (history) => history.accountDetails.propFirm
                          )
                        ),
                      ].map((propFirm, index) => (
                        <TabsContent key={index} value={propFirm}>
                          <Tabs className="w-full">
                            <TabsList className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 h-auto max-h-[250px] lg:min-h-0">
                              {[
                                ...new Set(
                                  tradeHistories
                                    .filter(
                                      (history) =>
                                        history.accountDetails.propFirm ===
                                        propFirm
                                    )
                                    .map(
                                      (filteredHistory) =>
                                        `Acc No: ${filteredHistory.accountDetails.accountNumber} ${filteredHistory.accountDetails.accountSize} ${filteredHistory.accountDetails.accountPhase}`
                                    )
                                ),
                              ].map((accountDetail, aIndex) => (
                                <TabsTrigger key={aIndex} value={accountDetail}>
                                  {accountDetail}
                                </TabsTrigger>
                              ))}
                            </TabsList>
                            {[
                              ...new Set(
                                tradeHistories
                                  .filter(
                                    (history) =>
                                      history.accountDetails.propFirm ===
                                      propFirm
                                  )
                                  .map(
                                    (filteredHistory) =>
                                      `Acc No: ${filteredHistory.accountDetails.accountNumber} ${filteredHistory.accountDetails.accountSize} ${filteredHistory.accountDetails.accountPhase}`
                                  )
                              ),
                            ].map((accountDetail, aIndex) => (
                              <TabsContent key={aIndex} value={accountDetail}>
                                <div className="flex flex-col justify-center m-5">
                                  <h3 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 justify-center flex mb-3">
                                    Trade History For
                                  </h3>
                                  <div className="flex gap-3 justify-center">
                                    <Badge>{propFirm}</Badge>{' '}
                                    <Badge>{accountDetail}</Badge>
                                  </div>
                                </div>
                                {/* <ScrollArea className="h-[450px] rounded-md border p-4 "> */}
                                <div className="overflow-y-auto h-[450px]">
                                  <DataTable
                                    columns={columns}
                                    data={
                                      tradeHistories.filter(
                                        (history) =>
                                          `Acc No: ${history.accountDetails.accountNumber} ${history.accountDetails.accountSize} ${history.accountDetails.accountPhase}` ===
                                            accountDetail &&
                                          history.accountDetails.propFirm ===
                                            propFirm
                                      )[0].trades
                                    }
                                  />
                                </div>
                                {/* </ScrollArea> */}
                              </TabsContent>
                            ))}
                          </Tabs>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
};

export default AccountInformation;
