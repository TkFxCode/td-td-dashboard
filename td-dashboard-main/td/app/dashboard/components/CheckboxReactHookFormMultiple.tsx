'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import { toast } from '@/app/components/ui/use-toast';
import { getallTradingAccountDocument } from '@/app/appwrite/services/tradingAccountService';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/dashboard/profile/components/form';

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
});

export function CheckboxReactHookFormMultiple({ userId }: { userId: string }) {
  const [items, setItems] = useState<{ id: string; label: string }[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });

  useEffect(() => {
    const fetchItems = async () => {
      const accounts = await getallTradingAccountDocument(userId);
      console.log(accounts);
      if (accounts.length) {
        const formattedAccounts = accounts.map((acc, index) => {
          const parsedAcc = JSON.parse(acc);
          return {
            id: `acc${index + 1}`,
            label: `${parsedAcc.propFirm} ${parsedAcc.accountSize} Account ${parsedAcc.accountPhase}`,
          };
        });
        setItems(formattedAccounts);
      } else {
        toast({ title: 'The user has no accounts.' });
      }
    };

    fetchItems();
  }, [userId]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const selectedItems = items.filter((item) => data.items.includes(item.id));
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(selectedItems, null, 2)}
          </code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Trading Accounts</FormLabel>
                <FormDescription>
                  Select from the list of accounts below.
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
