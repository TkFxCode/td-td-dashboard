import * as React from 'react';
import { Check } from 'lucide-react';

import { CommandGroup, CommandItem } from '@/app/components/ui/command';
import { cn } from '@/lib/utils';

type Account = {
  label: string;
  value: string;
};

interface SelectOwnAccountsProps {
  selectedAccount: Account;
  setSelectedAccount: (account: Account) => void;
  setOpen: (isOpen: boolean) => void;
}

const SelectOwnAccounts: React.FC<SelectOwnAccountsProps> = ({
  selectedAccount,
  setSelectedAccount,
  setOpen,
}) => {
  const account = {
    label: 'Select your own accounts',
    value: 'select',
  };

  return (
    <CommandGroup heading="Individual Accounts">
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
    </CommandGroup>
  );
};

export default SelectOwnAccounts;
