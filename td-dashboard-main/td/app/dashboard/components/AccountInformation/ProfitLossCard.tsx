import React, { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';

interface ProfitLossCardProps {
  trades: any[];
}

const ProfitLossCard: React.FC<ProfitLossCardProps> = ({ trades }) => {
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [totalProfitLastMonth, setTotalProfitLastMonth] = useState<number>(0);

  useEffect(() => {
    // Calculate total profit/loss
    let total = 0;
    trades.forEach((trade) => {
      total += trade.profit;
    });
    setTotalProfit(total);

    // TODO: Calculate total profit/loss for last month
    // setTotalProfitLastMonth(...)
  }, [trades]);

  return (
    <div className="card hover:bg-gray-200 dark:hover:bg-slate-700">
      <div className="card-header flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="card-title text-sm font-medium">Total Profit/Loss</div>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="card-content">
        <div className="text-2xl font-bold">{`$${totalProfit.toFixed(2)}`}</div>
        <p className="text-xs text-muted-foreground">{`${
          totalProfitLastMonth > 0 ? '+' : ''
        }${
          ((totalProfit - totalProfitLastMonth) / totalProfitLastMonth) * 100
        }% from last month`}</p>
      </div>
    </div>
  );
};

export default ProfitLossCard;
