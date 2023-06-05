import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/app/components/ui/hover-card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Event, ApiData } from './types';

interface DailyHighImpactProps {
  data: ApiData;
}

const DailyHighImpact: React.FC<DailyHighImpactProps> = ({ data }) => {
  const highImpactEventsByDay = (day: string) => {
    const eventsCount = data.filter((event) => {
      const date = new Date(event.date);
      const dayOfWeek = date
        .toLocaleString('en-US', { weekday: 'long' })
        .toLowerCase();
      return dayOfWeek === day && event.impact === 'High';
    }).length;

    return '|'.repeat(eventsCount);
  };

  const highImpactEventsDetailsByDay = (day: string) => {
    return data.filter((event) => {
      const date = new Date(event.date);
      const dayOfWeek = date
        .toLocaleString('en-US', { weekday: 'long' })
        .toLowerCase();
      return dayOfWeek === day && event.impact === 'High';
    });
  };

  return (
    <Card className="w-full  ">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold py-2">
          High Impact by Day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 ">
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(
            (day) => (
              <Card
                key={day}
                className="flex flex-row items-center justify-between border rounded px-4 py-2 dark:hover:bg-secondary hover:bg-secondary "
              >
                <div className="text-xl font-bold h-full flex items-center">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </div>

                <HoverCard>
                  <HoverCardTrigger>
                    <Badge
                      variant="destructive"
                      className="text-xl font-bold h-full min-w-[50px] flex items-center justify-center"
                    >
                      {highImpactEventsByDay(day)}
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-auto">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight flex justify-center ">
                      More Information
                    </h3>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {highImpactEventsDetailsByDay(day).map((event) => (
                          <TableRow key={event.title}>
                            <TableCell>{event.title}</TableCell>
                            <TableCell>{event.date}</TableCell>
                            <TableCell>{event.time}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </HoverCardContent>
                </HoverCard>
              </Card>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyHighImpact;
