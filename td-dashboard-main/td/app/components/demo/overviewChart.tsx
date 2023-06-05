'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import { useState } from 'react';

const data = [
  {
    name: 'Jan',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Feb',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Mar',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Apr',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'May',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Jun',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Jul',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Aug',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Sep',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Oct',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Nov',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Dec',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

export function Overview() {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <div className=" w-auto h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            className="text-xs md:text-sm"
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            className="text-xs md:text-sm"
          />
          <Bar
            dataKey="total"
            fill={theme === 'light' ? '#f1f5f9' : 'var(--accent)'}
            radius={[4, 4, 0, 0]}
            className={classNames(
              'transition-all duration-200 ease-in',
              theme === 'light' ? 'bar-fill-light' : 'bar-fill-dark',
              theme === 'light' ? 'bar-stroke-light' : 'bar-stroke-dark'
            )}
            onMouseEnter={(data, index) => {
              setActiveIndex(index);
            }}
            onMouseLeave={() => {
              setActiveIndex(null);
            }}
            isAnimationActive={false}
            shape={(props) => {
              const { fill, x, y, width, height } = props;
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={fill}
                  stroke={props.index === activeIndex ? '#888888' : 'none'}
                  strokeWidth={2}
                  rx={4}
                  ry={4}
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
