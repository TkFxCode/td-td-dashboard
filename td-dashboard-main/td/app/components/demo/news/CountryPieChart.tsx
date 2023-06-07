import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Event, ApiData } from './types';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';

interface CountryPieChartProps {
  data: ApiData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CountryPieChart: React.FC<CountryPieChartProps> = ({ data }) => {
  const [filterToday, setFilterToday] = useState(false);

  const toggleFilterToday = () => setFilterToday(!filterToday);

  const newsCountByCountry = data.reduce<{ [key: string]: number }>(
    (count, event) => {
      const date = new Date(event.date);
      const today = new Date();
      if (
        !filterToday ||
        (date >= today && date <= new Date(today.setDate(today.getDate() + 7)))
      ) {
        count[event.country] = (count[event.country] || 0) + 1;
      }
      return count;
    },
    {}
  );

  const pieChartData = Object.keys(newsCountByCountry).map((country) => ({
    name: country,
    value: newsCountByCountry[country],
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold py-2">
          Country Event Distribution
        </CardTitle>
        <div className="flex justify-center items-center space-x-2">
          <Switch
            id="date-filter"
            checked={filterToday}
            onCheckedChange={toggleFilterToday}
          />
          <Label htmlFor="date-filter">Filter by Todays Date</Label>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col w-full">
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight border-b pb-2 flex justify-center">
              Pie Chart Legend
            </h4>
          </div>
          <div className="flex flex-wrap justify-center mt-4">
            {pieChartData.map((entry, index) => (
              <Badge
                key={entry.name}
                variant="outline"
                style={{
                  backgroundColor: COLORS[index % COLORS.length],
                  color: '#fff',
                  marginRight: '10px',
                  marginTop: '10px',
                }}
              >
                {entry.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CountryPieChart;
