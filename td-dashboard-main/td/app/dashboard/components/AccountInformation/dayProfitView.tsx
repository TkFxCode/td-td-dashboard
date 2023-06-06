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

type DataItem = { day?: string; profit: number };

const mockDataDay = [
  { day: 'Mon', profit: 100 },
  { day: 'Tue', profit: 200 },
  { day: 'Wed', profit: 150 },
  { day: 'Thu', profit: 220 },
  { day: 'Fri', profit: 230 },
];

const DayProfitView = ({ dailyProfits }: { dailyProfits: DataItem[] }) => {
  const { theme } = useTheme();
  const isSmallScreen = useMediaQuery({ query: '(max-width: 576px)' }); // for sm screens
  const chartWidth = isSmallScreen ? 250 : 380;

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
          <h3>Profit Summary by Day</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center w-full h-full">
        <BarChart
          width={chartWidth}
          height={500}
          data={dailyProfits}
          className="lg:mr-8 "
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" className="text-xs" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="profit"
            fill={theme === 'light' ? '#f1f5f9' : '#334155'}
          />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default DayProfitView;
