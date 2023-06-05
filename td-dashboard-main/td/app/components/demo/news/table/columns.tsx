'use client';
import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import moment from 'moment';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';

type BadgeClassKeys = 'High' | 'Medium' | 'Low' | 'Holiday';

// This tells TypeScript that the keys of badgeClasses can only be 'High', 'Medium', 'Low', or 'Holiday'.
const badgeClasses: Record<BadgeClassKeys, string> = {
  High: 'bg-red-500',
  Medium: 'bg-orange-500',
  Low: 'bg-green-500',
  Holiday: 'bg-blue-500',
};

import { ColumnDef } from '@tanstack/react-table'; // The globe SVG icon as a string
const GlobeSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2 2 2 0 002 2v.488M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

// This type is used to define the shape of our data.
export type Event = {
  title: string;
  country: string;
  date: string;
  time: string;
  impact: string;
  forecast: string;
  previous: string;
};
function getCountryCode(currencyCode: string): string {
  const map: { [key: string]: string } = {
    NZD: 'NZ',
    AUD: 'AU',
    CNY: 'CN',
    EUR: 'EU',
    CHF: 'CH',
    GBP: 'GB',
    USD: 'US',
    JPY: 'JP',
    CAD: 'CA',
  };

  return map[currencyCode] || 'ALL';
}

export const columns: ColumnDef<Event>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'country',
    header: 'Country',
    cell: ({ row }) => {
      const country = row.getValue('country') as string;

      const countryCode = getCountryCode(country);
      return (
        <Badge variant="outline">
          <div className="flex flex-row gap-3 items-center  justify-between">
            <div>
              {countryCode === 'ALL' ? (
                <div
                  dangerouslySetInnerHTML={{ __html: GlobeSvg }}
                  style={{ width: '2em', height: '2em' }}
                />
              ) : (
                <ReactCountryFlag
                  countryCode={countryCode}
                  svg
                  style={{
                    width: '2em',
                    height: '2em',
                  }}
                />
              )}
            </div>
            <div>{country}</div>
          </div>
        </Badge>
      );
    },
  },

  {
    accessorKey: 'date',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('date') as string);
      const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: 'time',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Time (UTC -4)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'impact',
    header: 'Impact',
    cell: ({ row }) => {
      const impact = row.getValue('impact') as string;
      const badgeClass =
        badgeClasses[impact as BadgeClassKeys] || 'bg-gray-500';

      return (
        <Badge
          variant="outline"
          className={`text-white flex justify-center ${badgeClass}`}
        >
          {impact}
        </Badge>
      );
    },
  },

  {
    accessorKey: 'forecast',
    header: 'Forecast',
  },
  {
    accessorKey: 'previous',
    header: 'Previous',
  },
  {
    accessorKey: 'tradeSession',
    header: 'Trade Session',
    cell: ({ row }) => {
      const time = row.getValue('time') as string;
      const formattedTime = moment(time as string, ['h:mm A']);

      let tradeSession = 'Tokyo'; // Set Tokyo as the default tradeSession

      if (
        formattedTime.isBetween(
          moment('03:00 am', 'h:mm A'),
          moment('08:00 am', 'h:mm A')
        )
      ) {
        tradeSession = 'London';
      } else if (
        formattedTime.isBetween(
          moment('08:00 am', 'h:mm A'),
          moment('08:00 pm', 'h:mm A')
        )
      ) {
        tradeSession = 'New York';
      }

      return <div>{tradeSession}</div>;
    },
  },

  // {
  //   accessorKey: 'outstanding',
  //   header: 'Time Remaining',
  // },
];
