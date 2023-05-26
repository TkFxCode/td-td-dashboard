'use client';

import { ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
export type Trade = {
  symbol: string;
  tradeType: string;
  volume: number;
  entryPrice: number;
  exitPrice: number;
  commission: number;
  swap: number;
  profit: number;
  partials: number;
};

export const columns: ColumnDef<Trade>[] = [
  {
    accessorKey: 'symbol',
    header: 'Symbol',
  },
  {
    accessorKey: 'tradeType',
    header: 'Trade Type',
  },
  {
    accessorKey: 'volume',
    header: 'Volume',
  },
  {
    accessorKey: 'entryPrice',
    header: 'Entry Price',
  },
  {
    accessorKey: 'exitPrice',
    header: 'Exit Price',
  },
  {
    accessorKey: 'commission',
    header: 'Commission',
  },
  {
    accessorKey: 'swap',
    header: 'Swap',
  },
  {
    accessorKey: 'profit',
    header: 'Profit',
  },
  {
    accessorKey: 'partials',
    header: 'Partials',
  },
];
