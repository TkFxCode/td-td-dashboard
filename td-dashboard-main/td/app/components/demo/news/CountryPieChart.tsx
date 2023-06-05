import React from 'react';
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

interface CountryPieChartProps {
  data: ApiData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CountryPieChart: React.FC<CountryPieChartProps> = ({ data }) => {
  const newsCountByCountry = data.reduce<{ [key: string]: number }>(
    (count, event) => {
      const date = new Date(event.date);
      const today = new Date();
      if (
        date >= today &&
        date <= new Date(today.setDate(today.getDate() + 7))
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
