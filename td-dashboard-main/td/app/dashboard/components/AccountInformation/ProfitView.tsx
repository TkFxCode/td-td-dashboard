import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useMediaQuery } from 'react-responsive';
import { useTheme } from 'next-themes';
import { Separator } from '@/app/components/ui/separator';
type DataItem = { day?: string; week?: string; month?: string; profit: number };

const mockDataDay = [
  { day: 'Mon', profit: 100 },
  { day: 'Tue', profit: 200 },
  { day: 'Wed', profit: 150 },
  { day: 'Thu', profit: 220 },
  { day: 'Fri', profit: 230 },
];

const mockDataWeek = [
  { week: 'Week 1', profit: 1400 },
  { week: 'Week 2', profit: 1500 },
  { week: 'Week 3', profit: 1600 },
  { week: 'Week 4', profit: 1700 },
];

const mockDataMonth = [
  { month: 'January', profit: 6000 },
  { month: 'February', profit: 6200 },
  { month: 'March', profit: 6400 },
  { month: 'April', profit: 6600 },
  // Continue for the rest of the months...
];

type ViewType = 'day' | 'week' | 'month';

const ProfitView = () => {
  const [view, setView] = useState<ViewType>('day');
  const { theme } = useTheme();
  const isSmallScreen = useMediaQuery({ query: '(max-width: 576px)' }); // for sm screens
  const chartWidth = isSmallScreen ? 190 : 380;

  const handlePrevClick = () => {
    setView((prevView) => {
      switch (prevView) {
        case 'day':
          return 'month';
        case 'week':
          return 'day';
        case 'month':
          return 'week';
        default:
          return 'day';
      }
    });
  };

  const handleNextClick = () => {
    setView((prevView) => {
      switch (prevView) {
        case 'day':
          return 'week';
        case 'week':
          return 'month';
        case 'month':
          return 'day';
        default:
          return 'day';
      }
    });
  };

  let data: DataItem[],
    xKey: string = '',
    yKey: string = '';

  switch (view) {
    case 'day':
      data = mockDataDay;
      xKey = 'day';
      yKey = 'profit';
      break;
    case 'week':
      data = mockDataWeek;
      xKey = 'week';
      yKey = 'profit';
      break;
    case 'month':
      data = mockDataMonth;
      xKey = 'month';
      yKey = 'profit';
      break;
    default:
      data = [];
  }
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
    <Card className="max-w-[428px] w-full">
      <CardHeader>
        <CardTitle className="flex justify-center items-center">
          <h3>Profit Summary</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center ">
        <BarChart
          width={chartWidth}
          height={500}
          data={data}
          className="lg:mr-8 "
        >
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
      <CardFooter className="flex flex-wrap items-center justify-between  lg:px-4 lg:mb-4">
        <Button onClick={handlePrevClick} className="p-2 rounded">
          Prev
        </Button>
        <p className=" flex justify-center pl-2 pr-2">
          {view.toUpperCase()} VIEW
        </p>
        <Button onClick={handleNextClick} className="p-2 rounded ">
          Next
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfitView;
