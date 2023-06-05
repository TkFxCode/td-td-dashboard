'use client';
import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import moment from 'moment';
import { ArrowUpDown, Clock, MoreHorizontal, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';

type BadgeClassKeys = 'High' | 'Medium' | 'Low' | 'Holiday';

const badgeClasses: Record<BadgeClassKeys, string> = {
  High: 'bg-red-500',
  Medium: 'bg-orange-500',
  Low: 'bg-green-500',
  Holiday: 'bg-blue-500',
};

import { ColumnDef } from '@tanstack/react-table';
const GlobeSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2 2 2 0 002 2v.488M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

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

const calculateCountdown = (dateString: string, timeString: string) => {
  const [month, day, year] = dateString.split('-');
  const [hour, minutePart] = timeString.split(':');
  const minute = minutePart.slice(0, 2);
  const period = minutePart.slice(2);

  let hour24 = parseInt(hour);
  if (period.toLowerCase() === 'pm' && hour24 < 12) {
    hour24 += 12;
  } else if (period.toLowerCase() === 'am' && hour24 === 12) {
    hour24 = 0;
  }

  const eventDate = new Date(
    Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      hour24,
      parseInt(minute)
    )
  );

  const now = new Date();

  let diffInMilliseconds = eventDate.getTime() - now.getTime();

  if (diffInMilliseconds < 0) {
    return (
      <div className="flex flex-row items-center  ">
        <Badge className="flex ">
          <X className="mr-2 h-4 w-4" />
          Passed
        </Badge>
      </div>
    );
  }

  const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  diffInMilliseconds %= 1000 * 60 * 60;
  const minutes = Math.floor(diffInMilliseconds / (1000 * 60));
  diffInMilliseconds %= 1000 * 60;
  const seconds = Math.floor(diffInMilliseconds / 1000);

  return (
    <div className="flex flex-row items-center ">
      <Badge className="flex ">
        <Clock className="mr-2 h-4 w-4" />
        {`${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
      </Badge>
    </div>
  );
};

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

      let tradeSession = 'Tokyo';

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

  {
    accessorKey: 'outstanding',
    header: 'Time Remaining',
    cell: ({ row }) => {
      const date = row.getValue('date') as string;
      const time = row.getValue('time') as string;

      const timeRemaining = calculateCountdown(date, time);

      return <div>{timeRemaining}</div>;
    },
  },
];
