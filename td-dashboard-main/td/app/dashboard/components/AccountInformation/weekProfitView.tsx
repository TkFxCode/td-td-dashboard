import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useMediaQuery } from 'react-responsive';
import { useTheme } from 'next-themes';
type DataItem = { week?: string; profit: number };

const mockDataWeek = [
  { week: 'Week 1', profit: 1400 },
  { week: 'Week 2', profit: 1500 },
  { week: 'Week 3', profit: 1600 },
  { week: 'Week 4', profit: 1700 },
];

const WeekProfitView = ({ weeklyProfits }: { weeklyProfits: DataItem[] }) => {
  const { theme } = useTheme();
  const isSmallScreen = useMediaQuery({ query: '(max-width: 576px)' });
  const chartWidth = isSmallScreen ? 250 : 380;

  let data: DataItem[] = weeklyProfits,
    xKey: string = 'week',
    yKey: string = 'profit';

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-2 rounded ${
            theme === 'light'
              ? 'bg-gray-100 text-gray-900'
              : 'bg-gray-800 text-gray-200'
          }`}
        >
          <p className="label">{`${label} : $ ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="max-w-[428px] w-full h-full">
      <CardHeader>
        <CardTitle className="flex justify-center items-center">
          <h3>Profit Summary by Week</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center w-full h-full">
        <BarChart width={chartWidth} height={500} data={data} className="">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} className="text-xs" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey={yKey}
            fill={theme === 'light' ? '#f1f5f9' : '#334155'}
          />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default WeekProfitView;
