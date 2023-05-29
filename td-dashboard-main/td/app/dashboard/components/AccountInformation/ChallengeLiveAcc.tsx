import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import DynamicDemoChallengeCard from './dynamicDemoChallengeCard';
export function ChallengeLiveAcc() {
  return (
    <Tabs
      defaultValue="challenge"
      className="max-w-2xl mx-auto my-10  shadow-sm rounded-xl overflow-hidden"
    >
      <TabsList className="flex justify-around  min-h-[50px]">
        <TabsTrigger
          value="challenge"
          className="w-full py-3 px-5 font-semibold text-center"
        >
          Challenge Accounts
        </TabsTrigger>
        <TabsTrigger
          value="live"
          className="w-full py-3 px-5 font-semibold text-center"
        >
          Live Accounts
        </TabsTrigger>
      </TabsList>

      <TabsContent value="challenge">
        <Card>
          <Card className="m-2">
            <CardHeader className="flex justify-between items-center px-5 py-3 border-b">
              <CardTitle className="text-lg font-semibold ">FTMO</CardTitle>
              <Tabs
                defaultValue="phase1"
                className="w-full mx-auto my-10  shadow-sm rounded-xl overflow-hidden"
              >
                <TabsList className="flex justify-around  min-h-[50px]">
                  <TabsTrigger
                    value="phase1"
                    className="w-full py-3 px-5 font-semibold text-center"
                  >
                    Phase 1
                  </TabsTrigger>
                  <TabsTrigger
                    value="phase2"
                    className="w-full py-3 px-5 font-semibold text-center"
                  >
                    Phase 2
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="phase1">
                  <DynamicDemoChallengeCard
                    tradingAccountNumber="123456"
                    startBalance={100000}
                    currentBalance={107500}
                    goalBalance={108000}
                    violationBalance={92000}
                    startDate="2023-05-01"
                    endDate="2023-06-01"
                  />
                </TabsContent>

                <TabsContent value="phase2">
                  <DynamicDemoChallengeCard
                    tradingAccountNumber="123456"
                    startBalance={100000}
                    currentBalance={107500}
                    goalBalance={108000}
                    violationBalance={92000}
                    startDate="2023-05-01"
                    endDate="2023-06-01"
                  />
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
          <Card className="m-2">
            <CardHeader className="flex justify-between items-center px-5 py-3 border-b">
              <CardTitle className="text-lg font-semibold ">
                MYForexFunds
              </CardTitle>
              <Tabs
                defaultValue="phase1"
                className="w-full mx-auto my-10  shadow-sm rounded-xl overflow-hidden"
              >
                <TabsList className="flex justify-around  min-h-[50px]">
                  <TabsTrigger
                    value="phase1"
                    className="w-full py-3 px-5 font-semibold text-center"
                  >
                    Phase 1
                  </TabsTrigger>
                  <TabsTrigger
                    value="phase2"
                    className="w-full py-3 px-5 font-semibold text-center"
                  >
                    Phase 2
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="phase1">
                  <DynamicDemoChallengeCard
                    tradingAccountNumber="123456"
                    startBalance={100000}
                    currentBalance={107500}
                    goalBalance={108000}
                    violationBalance={92000}
                    startDate="2023-05-01"
                    endDate="2023-06-01"
                  />
                </TabsContent>

                <TabsContent value="phase2">
                  <DynamicDemoChallengeCard
                    tradingAccountNumber="123456"
                    startBalance={100000}
                    currentBalance={107500}
                    goalBalance={108000}
                    violationBalance={92000}
                    startDate="2023-05-01"
                    endDate="2023-06-01"
                  />
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </Card>
      </TabsContent>

      <TabsContent value="live"></TabsContent>
    </Tabs>
  );
}
