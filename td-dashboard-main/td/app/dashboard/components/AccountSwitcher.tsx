import * as React from 'react';
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  SearchIcon,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
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
import { CheckboxReactHookFormMultiple } from './CheckboxReactHookFormMultiple';
import {
  useUser,
  addTradingAccount,
  getTradingAccountDocument,
} from '@/app/appwrite/useUser';
import { useState, useEffect } from 'react';
import AccountInformation from './AccountInformation';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/app/components/ui/hover-card';
import { Card } from '@/app/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { Switch } from '@/app/components/ui/switch';
type AccountDetail = {
  propFirm: string;
  shareURL: string;
  accountSize: string;
  accountPhase: string;
};

type Account = {
  label: string;
  value: string;
  accountDetails: AccountDetail[];
};

type AccountGroup = {
  label: string;
  accounts: Account[];
};
const accountGroups: AccountGroup[] = [
  {
    label: 'Account Overview',
    accounts: [
      {
        label: 'All Accounts',
        value: 'all',
        accountDetails: [],
      },
    ],
  },
];

export default function AccountSwitcher() {
  const [open, setOpen] = React.useState(false);
  const [showNewAccountDialog, setShowNewAccountDialog] = React.useState(false);
  const [showSearchAccountDialog, setShowSearchAccountDialog] =
    React.useState(false);
  const [searchedAccount, setSearchedAccount] = React.useState<string>('');
  const [selectedAccount, setSelectedAccount] = React.useState<Account>(
    accountGroups[0].accounts[0]
  );
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const { user, getUserDocument } = useUser();
  const [userData, setUserData] = useState<any>(null);
  type AccountDetail = {
    propFirm: string;
    shareURL: string;
    accountSize: string;
    accountPhase: string;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const document = await getTradingAccountDocument(user.$id);
        if (document) {
          const accountTypes = [
            'FTMO',
            'MyForexFunds',
            'MyFundedFx',
            'BespokeFunding',
            'TrueForexFunds',
          ];

          // Create an empty array for 'All Accounts'
          let allAccounts: AccountDetail[] = [];

          // Clear existing accounts before adding new ones
          accountGroups[0].accounts = [
            {
              label: 'All Accounts',
              value: 'all',
              accountDetails: allAccounts, // Link the allAccounts array to the accountDetails
            },
          ];

          console.log(document);

          let totalAccounts = 0;
          accountTypes.forEach((type) => {
            if (document[type].length > 0) {
              totalAccounts += document[type].length;

              // Parse the accounts' data from stringified JSON to JavaScript objects
              const parsedAccounts = document[type].map((account: string) =>
                JSON.parse(account)
              );

              // Add parsed accounts to allAccounts array
              allAccounts.push(...parsedAccounts);

              // Store parsed accounts' data in the accounts' section for this account type
              accountGroups[0].accounts.push({
                label: `All ${type} Accounts (${document[type].length})`,
                value: type.toLowerCase(),
                accountDetails: parsedAccounts, // Store the parsed accounts' data here
              });
            }
          });

          // Add the total number of accounts in brackets
          accountGroups[0].accounts[0].label += ` (${totalAccounts})`;

          setUserData(document);
          setSelectedAccount(accountGroups[0].accounts[0]);
        }
      }
    };

    fetchData();
  }, [user]);

  const [propFirm, setPropFirm] = useState('');
  const [shareURL, setShareURL] = useState('');

  const handleAddAccount = async () => {
    await addTradingAccount(
      user.$id,
      propFirm,
      accountSize,
      accountPhase,
      shareURL
    );
    setShowNewAccountDialog(false);
  };
  const [accountSize, setAccountSize] = useState('');
  const handleAccountSizeChange = (value: string) => {
    setAccountSize(value);
  };

  const [accountPhase, setAccountPhase] = useState('');
  const handleAccountPhaseChange = (value: string) => {
    setAccountPhase(value);
  };
  const handlePropFirmChange = (value: string) => {
    setPropFirm(value);
  };
  return (
    <>
      <div className="flex flex-row justify-center items-start">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              role="combobox"
              aria-expanded={open}
              aria-label="Select an account"
              className={cn('w-full mt-1 h-10 mb-5 justify-between ')}
            >
              {selectedAccount.label}
              <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0">
            <Command>
              <CommandList>
                <CommandInput placeholder="Search account..." />
                <CommandEmpty>No account found.</CommandEmpty>
                {accountGroups
                  .filter((group) => group.label !== 'Individual Accounts')
                  .map((group) => (
                    <CommandGroup key={group.label} heading={group.label}>
                      {group.accounts.map((account) => (
                        <CommandItem
                          key={account.value}
                          onSelect={() => {
                            setSelectedAccount(account);
                            setOpen(false);
                          }}
                          className="text-sm"
                        >
                          {account.label}
                          <Check
                            className={cn(
                              'ml-auto h-4 w-4',
                              selectedAccount.value === account.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
              </CommandList>
              <CommandSeparator />
              <CommandList>
                <CommandGroup heading="Search Individual Accounts">
                  <Dialog
                    open={showSearchAccountDialog}
                    onOpenChange={setShowSearchAccountDialog}
                  >
                    <DialogTrigger asChild>
                      <CommandItem
                        onSelect={() => {
                          setOpen(true);
                          setShowSearchAccountDialog(true);
                        }}
                      >
                        <SearchIcon className="mr-2 h-5 w-5" />
                        Search Accounts
                      </CommandItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Search Accounts</DialogTitle>
                      </DialogHeader>
                      <div>
                        <div className="space-y-4 py-2 pb-4">
                          {/* Add the checkbox for trading accounts */}
                          <div className="space-y-2">
                            <CheckboxReactHookFormMultiple userId={user.$id} />
                          </div>
                          {/* Add any additional input fields as necessary */}
                        </div>
                      </div>
                      <DialogFooter></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CommandGroup>
                <CommandGroup heading="Update Porfolio">
                  <Dialog
                    open={showNewAccountDialog}
                    onOpenChange={setShowNewAccountDialog}
                  >
                    <DialogTrigger asChild>
                      <CommandItem
                        onSelect={() => {
                          setOpen(true);
                          setShowNewAccountDialog(true);
                        }}
                      >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Add New Account
                      </CommandItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Account</DialogTitle>
                        <DialogDescription>
                          Add a new account to your trading portfolio.
                        </DialogDescription>
                      </DialogHeader>
                      <div>
                        <div className="space-y-4 py-2 pb-4">
                          <div className="space-y-2">
                            <Label htmlFor="propFirm">Prop Firm</Label>
                            <Select onValueChange={handlePropFirmChange}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a Prop Firm" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Prop Firms</SelectLabel>
                                  <SelectItem value="FTMO">FTMO</SelectItem>
                                  <SelectItem value="MyForexFunds">
                                    MyForexFunds
                                  </SelectItem>
                                  <SelectItem value="MyFundedFx">
                                    MyFundedFx
                                  </SelectItem>
                                  <SelectItem value="BespokeFunding">
                                    Bespoke Funding
                                  </SelectItem>
                                  <SelectItem value="TrueForexFunds">
                                    TrueForexFunds
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="accountSize">Account Size</Label>
                            <Select onValueChange={handleAccountSizeChange}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an Account Size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Account Sizes</SelectLabel>
                                  <SelectItem value="5k">5k</SelectItem>
                                  <SelectItem value="10k">10k</SelectItem>
                                  <SelectItem value="25k">25k</SelectItem>
                                  <SelectItem value="50k">50k</SelectItem>
                                  <SelectItem value="100k">100k</SelectItem>
                                  <SelectItem value="200k">200k</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="accountPhase">Account Phase</Label>
                            <Select onValueChange={handleAccountPhaseChange}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an Account Phase" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Account Phases</SelectLabel>
                                  <SelectItem value="Phase 1">
                                    Phase 1
                                  </SelectItem>
                                  <SelectItem value="Phase 2">
                                    Phase 2
                                  </SelectItem>
                                  <SelectItem value="Live Account">
                                    Live Account
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="shareURL">Account Share URL</Label>
                            <Input
                              id="shareURL"
                              placeholder="https://shareUrl@PropFirm.com"
                              onChange={(e) => setShareURL(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowNewAccountDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="button" onClick={handleAddAccount}>
                          Add
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="secondary" className="ml-1 mt-1">
              Trading Accounts
            </Button>
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
      </div>
      <AccountInformation selectedAccount={selectedAccount} />
    </>
  );
}
