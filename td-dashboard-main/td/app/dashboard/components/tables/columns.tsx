'use client';

import { ColumnDef } from '@tanstack/react-table';

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
    accessorKey: 'entryTime',
    header: 'Entry Time',
    cell: ({ row }) => {
      const entryTime = new Date(row.getValue('entryTime'));
      const formattedEntryTime = entryTime.toLocaleString('en-US');

      return <div>{formattedEntryTime}</div>;
    },
  },
  {
    accessorKey: 'tradeType',
    header: 'Trade Type',
    cell: ({ row }) => {
      const tradeType = row.getValue('tradeType');

      const formattedTradeType =
        tradeType === 'DEAL_TYPE_BUY' ? 'Buy Trade' : 'Sell Trade';

      return <div>{formattedTradeType}</div>;
    },
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
    header: () => <div className="text-right">Commission</div>,
    cell: ({ row }) => {
      const commission = parseFloat(row.getValue('commission'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(commission);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'swap',
    header: () => <div className="text-right">Swap</div>,
    cell: ({ row }) => {
      const swap = parseFloat(row.getValue('swap'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(swap);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'profit',
    header: () => <div className="text-right">Profit</div>,
    cell: ({ row }) => {
      const profit = parseFloat(row.getValue('profit'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(profit);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'partials',
    header: 'Partials',
  },

  {
    accessorKey: 'exitTime',
    header: 'Exit Time',
    cell: ({ row }) => {
      const exitTime = new Date(row.getValue('exitTime'));
      const formattedExitTime = exitTime.toLocaleString('en-US');

      return <div>{formattedExitTime}</div>;
    },
  },
];
