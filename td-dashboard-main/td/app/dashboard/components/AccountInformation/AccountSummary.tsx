import React from 'react';
import {
  Card,
  CardContent,
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
import DynamicLiveAccountCard from './dynamicDemoLiveCard';

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
type AccountDetail = {
  propFirm: string;
  shareURL: string;
  accountSize: string;
  accountPhase: string;
  accountNumber: string;
  startDate: Date;
  endDate: Date;
};

const AccountDetails = ({ account }: { account: SelectedAccountType }) => {
  //console.log('Account Details sum:', account);

  const groupedAccounts = account.accountDetails.reduce<{
    [propFirm: string]: {
      'Phase 1': Array<AccountDetail>;
      'Phase 2': Array<AccountDetail>;
      'Live Account': Array<AccountDetail>;
    };
  }>((acc, currAccount) => {
    if (!acc[currAccount.propFirm]) {
      acc[currAccount.propFirm] = {
        'Phase 1': [],
        'Phase 2': [],
        'Live Account': [],
      };
    }
    acc[currAccount.propFirm][
      currAccount.accountPhase as 'Phase 1' | 'Phase 2' | 'Live Account'
    ].push(currAccount);

    return acc;
  }, {});

  return (
    <Tabs
      defaultValue="challenge"
      className="w-full mx-auto my-10  shadow-sm rounded-xl overflow-hidden"
    >
      <TabsList className="flex justify-around  min-h-[50px]">
        <TabsTrigger
          value="challenge"
          className="w-full py-3 px-5 sm:px-1 font-semibold text-center"
        >
          Challenge Accounts
        </TabsTrigger>
        <TabsTrigger
          value="live"
          className="w-full py-3 px-5 sm:px-1 font-semibold text-center"
        >
          Live Accounts
        </TabsTrigger>
      </TabsList>

      <TabsContent value="challenge">
        {Object.entries(groupedAccounts).map(([propFirm, accounts]) => (
          <Card key={propFirm} className="mb-2">
            <CardHeader className="flex justify-between items-center px-5 py-3 border-b">
              <CardTitle className="text-lg font-semibold">
                {propFirm}
              </CardTitle>
              <Tabs
                defaultValue="phase1"
                className="w-full mx-auto my-10  shadow-sm rounded-xl overflow-hidden"
              >
                <TabsList className="flex justify-around  min-h-[50px]">
                  <TabsTrigger
                    value="phase1"
                    className="w-full py-3 px-5 sm:px-1 font-semibold text-center"
                  >
                    Phase 1
                  </TabsTrigger>
                  <TabsTrigger
                    value="phase2"
                    className="w-full py-3 px-5 sm:px-1 font-semibold text-center"
                  >
                    Phase 2
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="phase1">
                  {accounts['Phase 1'].map((account) => (
                    <DynamicDemoChallengeCard
                      key={account.accountNumber}
                      tradingAccountNumber={account.accountNumber}
                      startBalance={parseInt(
                        account.accountSize.replace('k', '000')
                      )}
                      apiKey={account.shareURL}
                      goalBalance={
                        parseInt(account.accountSize.replace('k', '000')) * 1.08
                      }
                      violationBalance={
                        parseInt(account.accountSize.replace('k', '000')) * 0.92
                      }
                      startDate={account.startDate}
                      endDate={account.endDate}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="phase2">
                  {accounts['Phase 2'].map((account) => (
                    <DynamicDemoChallengeCard
                      key={account.accountNumber}
                      tradingAccountNumber={account.accountNumber}
                      startBalance={parseInt(
                        account.accountSize.replace('k', '000')
                      )}
                      apiKey={account.shareURL}
                      goalBalance={
                        parseInt(account.accountSize.replace('k', '000')) * 1.05
                      }
                      violationBalance={
                        parseInt(account.accountSize.replace('k', '000')) * 0.92
                      }
                      startDate={account.startDate}
                      endDate={account.endDate}
                    />
                  ))}
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="live">
        {Object.entries(groupedAccounts).map(([propFirm, accounts]) => (
          <Card key={propFirm} className="m-2 ">
            <CardHeader className="flex justify-between items-center px-5 py-3 border-b">
              <CardTitle className="text-lg font-semibold">
                {propFirm}
              </CardTitle>
              <CardContent className="w-full">
                {accounts['Live Account'].map((account) => (
                  <DynamicLiveAccountCard
                    key={account.accountNumber}
                    tradingAccountNumber={account.accountNumber}
                    startBalance={parseInt(
                      account.accountSize.replace('k', '000')
                    )}
                    startDate={account.startDate}
                    apiKey={account.shareURL}
                    endDate={account.endDate}
                  />
                ))}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default AccountDetails;
