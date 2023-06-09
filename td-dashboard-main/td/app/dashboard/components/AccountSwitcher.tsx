import * as React from 'react';
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  PlusCircle,
  SearchIcon,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import { addDays, format } from 'date-fns';
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
import { useUser } from '@/app/appwrite/useUser';
import {
  addTradingAccount,
  getTradingAccountDocument,
} from '@/app/appwrite/services/tradingAccountService';
import { useState, useEffect } from 'react';
import AccountInformation from './AccountInformation/AccountInformation';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/app/components/ui/hover-card';
import { Card } from '@/app/components/ui/card';
import { Switch } from '@/app/components/ui/switch';
import { Calendar } from '@/app/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
type AccountDetail = {
  propFirm: string;
  shareURL: string;
  accountSize: string;
  accountPhase: string;
  accountNumber: string;
  startDate: Date;
  endDate: Date;
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
  const [startDate, setstartDate] = useState<Date | undefined>(new Date());
  const [endDate, setendDate] = useState<Date | undefined>(new Date());
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
  const [useURL, setUseURL] = useState(true);
  const [csvData, setCsvData] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedCSVProcessor, setSelectedCSVProcessor] =
    useState('processCSVData');
  const [refreshKey, setRefreshKey] = useState(0);

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
            'personal-accounts',
          ];

          let allAccounts: AccountDetail[] = [];

          accountGroups[0].accounts = [
            {
              label: 'All Accounts',
              value: 'all',
              accountDetails: allAccounts,
            },
          ];

          //console.log(document);

          let totalAccounts = 0;
          accountTypes.forEach((type) => {
            if (document[type].length > 0) {
              totalAccounts += document[type].length;

              const parsedAccounts = document[type].map((account: string) =>
                JSON.parse(account)
              );

              allAccounts.push(...parsedAccounts);

              accountGroups[0].accounts.push({
                label: `All ${type} Accounts (${document[type].length})`,
                value: type.toLowerCase(),
                accountDetails: parsedAccounts,
              });
            }
          });

          accountGroups[0].accounts[0].label += ` (${totalAccounts})`;

          setUserData(document);
          setSelectedAccount(accountGroups[0].accounts[0]);
        }
      }
    };

    fetchData();
  }, [user, refreshKey]);

  const [propFirm, setPropFirm] = useState('');
  const [shareURL, setShareURL] = useState('');

  const handleAddAccount = async () => {
    if (!startDate || !endDate) {
      throw new Error('Start date or end date is not defined.');
    }
    await addTradingAccount(
      user.$id,
      propFirm,
      accountSize,
      accountPhase,
      accountNumber,
      useURL ? shareURL : '',
      !useURL ? csvData : '',
      startDate,
      endDate,
      selectedCSVProcessor
    );
    setShowNewAccountDialog(false);
    setRefreshKey(refreshKey + 1);
  };
  const handleAccountNumberChange = (value: string) => {
    setAccountNumber(value);
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
                          <div className="space-y-2">
                            <CheckboxReactHookFormMultiple userId={user.$id} />
                          </div>
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
                            <Label htmlFor="propFirm">
                              Prop Firm / Peronal Account
                            </Label>
                            <Select onValueChange={handlePropFirmChange}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a Prop Firm or Personal Account" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Personal Account</SelectLabel>
                                  <SelectItem value="personal-accounts">
                                    Personal Account
                                  </SelectItem>
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
                            <Label htmlFor="accountNumber">
                              Account Number
                            </Label>
                            <Input
                              id="accountNumber"
                              placeholder="Enter Account Number"
                              onChange={(e) =>
                                handleAccountNumberChange(e.target.value)
                              }
                            />
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
                          <div className="grid gap-2">
                            <Label htmlFor="dueDate">Start Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full justify-start text-left font-normal',
                                    !startDate && 'text-muted-foreground'
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {startDate ? (
                                    format(startDate, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                                <Select
                                  onValueChange={(value) =>
                                    setstartDate(
                                      addDays(new Date(), parseInt(value))
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent position="popper">
                                    <SelectItem value="0">Today</SelectItem>
                                    <SelectItem value="1">Tomorrow</SelectItem>
                                    <SelectItem value="3">In 3 days</SelectItem>
                                    <SelectItem value="7">In a week</SelectItem>
                                  </SelectContent>
                                </Select>
                                <div className="rounded-md border">
                                  <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setstartDate}
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="grid gap-2 ">
                            <Label htmlFor="dueDate">End Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full justify-start text-left font-normal',
                                    !endDate && 'text-muted-foreground'
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {endDate ? (
                                    format(endDate, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                                <Select
                                  onValueChange={(value) =>
                                    setendDate(
                                      addDays(new Date(), parseInt(value))
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent position="popper">
                                    <SelectItem value="0">Today</SelectItem>
                                    <SelectItem value="1">Tomorrow</SelectItem>
                                    <SelectItem value="3">In 3 days</SelectItem>
                                    <SelectItem value="7">In a week</SelectItem>
                                  </SelectContent>
                                </Select>
                                <div className="rounded-md border">
                                  <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setendDate}
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="inputSwitch">
                              {useURL ? (
                                <div className="space-y-2">
                                  <Label htmlFor="shareURL">
                                    Account Share URL
                                  </Label>
                                  <p>Api works for TrueForexFunds</p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Label htmlFor="csvUpload">Upload CSV</Label>
                                </div>
                              )}
                            </Label>
                            <Switch
                              id="inputSwitch"
                              checked={useURL}
                              onCheckedChange={setUseURL}
                            />
                          </div>
                          {useURL ? (
                            <div className="space-y-2">
                              <Input
                                id="shareURL"
                                placeholder="https://shareUrl@PropFirm.com"
                                onChange={(e) => setShareURL(e.target.value)}
                              />
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div>
                                <Label>
                                  <p>
                                    Choose between FTMO CSV or Metatrader CSV.
                                    You can find the script to create a
                                    MetaTrader csv at{' '}
                                    <a
                                      href="https://www.mql5.com/en/market/product/61601?source=Site+Market+MT5+Free+Search+Rating006%3acsv"
                                      style={{
                                        fontWeight: 'bold',
                                        textDecoration: 'underline',
                                      }}
                                    >
                                      MetaTrader MQL5 Script
                                    </a>
                                  </p>
                                </Label>
                              </div>
                              <div className="space-y-2 flex flex-col ">
                                <Label htmlFor="csvProcessor">
                                  Select CSV Processor
                                </Label>
                                <Card>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="w-full"
                                      >
                                        {selectedCSVProcessor}
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem
                                        onSelect={() =>
                                          setSelectedCSVProcessor(
                                            'processCSVData'
                                          )
                                        }
                                      >
                                        Process FTMO CSV File
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onSelect={() =>
                                          setSelectedCSVProcessor(
                                            'processMetaTraderCSVData'
                                          )
                                        }
                                      >
                                        Process MetaTrader CSV File
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </Card>
                              </div>

                              <Input
                                type="file"
                                id="csvUpload"
                                onChange={(e) => {
                                  if (e.target.files) {
                                    const file = e.target.files[0];
                                    const reader = new FileReader();
                                    reader.onload = (evt) => {
                                      setCsvData(evt.target?.result as string);
                                    };
                                    reader.readAsText(file);
                                  }
                                }}
                              />
                            </div>
                          )}
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
      </div>
      <AccountInformation selectedAccount={selectedAccount} />
    </>
  );
}
