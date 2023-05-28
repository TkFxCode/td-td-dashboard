import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

interface Params {
  apiKey: string;
}

interface Trade {
  positionId: string;
  type: string;
  symbol: string;
  volume: number;
  price: number;
  entryType: string;
  commission: number;
  swap: number;
  profit: number;
  time: string;
}

interface GroupedTrade {
  symbol: string;
  tradeType: string;
  volume: number;
  entryPrice: number;
  exitPrice: number;
  commission: number;
  swap: number;
  profit: number;
  partials: number;
  entryTime: string; // add entryTime
  exitTime: string; // add exitTime
}

export async function GET(
  request: NextApiRequest,
  { params }: { params: Params },
  response: NextApiResponse
) {
  const apiKey = params.apiKey;
  try {
    const response = await axios.get<{ content: Trade[] }>(
      `https://app.trueforexfunds.com/api/v1/public/challenges/deals/compacted?size=2147483647&key=${apiKey}`
    );
    const tradesData = response.data.content;

    let startingBalance = 0;
    let totalTrades = 0;

    const groupedTrades: Record<string, GroupedTrade> = {};

    for (let trade of tradesData) {
      const id = trade.positionId;

      if (trade.type === 'DEAL_TYPE_BALANCE') {
        startingBalance = trade.profit;
      }

      if (id) {
        if (!groupedTrades[id]) {
          totalTrades += 1;
          groupedTrades[id] = {
            symbol: trade.symbol,
            tradeType: '',
            volume: 0,
            entryPrice: 0,
            exitPrice: 0,
            commission: 0,
            swap: 0,
            profit: 0,
            partials: 0,
            entryTime: '', // add entryTime
            exitTime: '', // add exitTime
          };
        }

        if (trade.entryType === 'DEAL_ENTRY_IN') {
          groupedTrades[id].tradeType = trade.type;
          groupedTrades[id].volume += trade.volume;
          groupedTrades[id].entryPrice = trade.price;
          groupedTrades[id].entryTime = trade.time; // set entryTime
        }

        if (trade.entryType === 'DEAL_ENTRY_OUT') {
          groupedTrades[id].exitPrice = trade.price;
          groupedTrades[id].exitTime = trade.time; // update exitTime
        }

        groupedTrades[id].commission += trade.commission;
        groupedTrades[id].swap += trade.swap;
        groupedTrades[id].profit +=
          trade.profit + trade.commission + trade.swap;
        groupedTrades[id].partials += 1;
      }
    }

    return new Response(
      JSON.stringify({
        status: 'success',
        startingBalance: startingBalance,
        totalTrades: totalTrades,
        trades: Object.values(groupedTrades),
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    return new Response(
      JSON.stringify({ status: 'error', message: (error as Error).message }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
