import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/app/components/ui/card';

const AccountCard = () => {
  const tradeData = [
    { name: 'Trade1', profit: -70 },
    { name: 'Trade2', profit: 100 },
    { name: 'Trade3', profit: -20 },
  ];
  const accountNumber = '1234213112';
  return (
    <Card className="hover:bg-gray-200 dark:hover:bg-slate-700 ">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Account: {accountNumber}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={tradeData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
