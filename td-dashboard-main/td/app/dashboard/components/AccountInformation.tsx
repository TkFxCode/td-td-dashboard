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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/app/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/app/components/ui/select';
import {
  Activity,
  CreditCard,
  Banknote,
  Star,
  LineChart,
  ChevronsUpDown,
} from 'lucide-react';
import { Overview } from '@/app/components/demo/overviewChart';
import { Trade, columns } from './tables/columns';
import { DataTable } from './tables/data-table';
import { listTradeHistory } from '@/app/appwrite/useUser';
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
import AccountDetails from './AccountInformation/AccountSummary';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
interface SelectedAccountType {
  label: string;
  value: string;
  accountDetails: {
    propFirm: string;
    shareURL: string;
    accountSize: string;
    accountPhase: string;
    accountNumber: string;
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

  const [tradeHistories, setTradeHistories] = useState<TradeHistory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const document = await getUserDocument(user.$id);
        setUserData(document);
      }
    };

    // Fetching the trade history for each account
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

            // Here we are combining account details with trade history
            return { apiKey, trades, accountDetails: account };
          })
        );
        setTradeHistories(allHistories);
      }
    };

    fetchTradeHistories();
    fetchData();
  }, [user, getUserDocument, selectedAccount.accountDetails]);
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
        : '0'; // Here is the change

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
          totalLossFromLosingTrades += Math.abs(trade.profit); // abs to make loss positive for calculation
        }
      });
    });

    const averageLossPerLosingTrade =
      losingTradesCount > 0
        ? (totalLossFromLosingTrades / losingTradesCount).toFixed(2)
        : '0'; // Here is the change

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
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
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
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
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
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
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
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>
      </CardHeader>
      <CardContent>
        <Card className="">
          <CardHeader>
            <CardTitle>Account summaries</CardTitle>
          </CardHeader>
          <CardContent className="m-0 p-0">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 md:flex-1">
                <Card className="p-3 pt-5 md:min-h-full">
                  <CardTitle>
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-center">
                      All Trade History
                    </h2>
                  </CardTitle>
                  <CardContent className="m-2 p-2">
                    <Tabs className="w-full">
                      <TabsList>
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
                            <TabsList>
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
                                <h3 className="text-foreground text-center">
                                  Trade History for {propFirm} {accountDetail}
                                </h3>
                                <ScrollArea className="h-[450px] rounded-md border p-4">
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
                                </ScrollArea>
                              </TabsContent>
                            ))}
                          </Tabs>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              <div className="flex-2">
                <Card className="md:min-h-full lg:min-w-[250px]">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Select a content"
                        className={cn(
                          'w-full mt-1 mb-1 h-[55px] justify-between '
                        )}
                      >
                        {selectedContent.label}
                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full lg:w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandItem
                            onSelect={() => {
                              setSelectedContent({
                                label: 'All Accounts Summary',
                                component: (
                                  <AccountDetails account={selectedAccount} />
                                ),
                              });
                              setOpen(false);
                            }}
                            className="text-sm"
                          >
                            All Accounts Summary
                          </CommandItem>
                          <CommandItem
                            onSelect={() => {
                              setSelectedContent({
                                label: 'All Archived Accounts',
                                component: (
                                  <AccountDetails account={selectedAccount} />
                                ),
                              });
                              setOpen(false);
                            }}
                            className="text-sm"
                          >
                            All Archived Accounts
                          </CommandItem>
                          <CommandItem
                            onSelect={() => {
                              setSelectedContent({
                                label: 'All Recorded Payouts',
                                component: (
                                  <AccountDetails account={selectedAccount} />
                                ),
                              });
                              setOpen(false);
                            }}
                            className="text-sm"
                          >
                            All Recorded Payouts
                          </CommandItem>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <ScrollArea className="h-[500px] w-full lg:h-[580px] lg:w-[500px] rounded-md border ">
                    <CardContent className="w-full">
                      {/* Display content based on selected item */}
                      {selectedContent.component}
                    </CardContent>
                  </ScrollArea>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>{' '}
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
        <h3 className="text-foreground mt-6 text-center">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">Trading Accounts</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Trading Accounts</h4>
                <p className="text-sm">
                  {selectedAccount.accountDetails &&
                    selectedAccount.accountDetails.map((account, index) => (
                      <Card key={index} className="p-2 m-2">
                        <p>PropFirm: {account.propFirm}</p>
                        <p>AccountSize: {account.accountSize}</p>
                        <p>AccountPhase: {account.accountPhase}</p>
                        <p>AccountPhase: {account.shareURL}</p>
                        <p>AccountNumber: {account.accountNumber}</p>
                      </Card>
                    ))}
                </p>
                <div className="flex items-center pt-2">
                  <Star className="mr-2 h-4 w-4 opacity-70" />{' '}
                  <span className="text-xs text-muted-foreground">
                    TheTradingDashboard
                  </span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </h3>
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

      <CardFooter>
        <Card className="w-full">
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter></CardFooter>
        </Card>
      </CardFooter>

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
