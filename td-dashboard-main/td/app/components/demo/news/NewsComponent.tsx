import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';

import React from 'react';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '../../ui/separator';
import { Event, ApiData } from './types';

interface NewsComponentProps {
  data: ApiData;
}

const NewsComponent: React.FC<NewsComponentProps> = ({ data }) => {
  const filterDataByDay = (data: ApiData, day: string) => {
    return data.filter((event) => {
      const date = new Date(event.date);
      return (
        date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase() === day
      );
    });
  };

  return (
    <Card className="w-full h-full">
      <Tabs defaultValue="today" className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold py-2">
            Weekly News
          </CardTitle>
        </CardHeader>
        <CardDescription>
          <TabsList className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2  min-h-[350px] lg:min-h-0">
            <Badge
              variant="outline"
              className="w-full lg:w-[130px]  lg:mr-5 flex justify-center h-full border-2"
            >
              Sort by:{' '}
            </Badge>
            <TabsTrigger className="w-full lg:w-auto" value="today">
              Today
            </TabsTrigger>
            <TabsTrigger className="w-full lg:w-auto " value="monday">
              Monday
            </TabsTrigger>
            <TabsTrigger className="w-full lg:w-auto " value="tuesday">
              Tuesday
            </TabsTrigger>
            <TabsTrigger className="w-full lg:w-auto " value="wednesday">
              Wednesday
            </TabsTrigger>
            <TabsTrigger className="w-full lg:w-auto " value="thursday">
              Thursday
            </TabsTrigger>
            <TabsTrigger className="w-full lg:w-auto " value="friday">
              Friday
            </TabsTrigger>
            <Separator
              orientation="vertical"
              className="hidden lg:inline-block border-r-4"
            />
            <TabsTrigger className="w-full lg:w-auto " value="all">
              This Week
            </TabsTrigger>
          </TabsList>
        </CardDescription>

        <CardContent>
          <TabsContent value="today">
            <div className="overflow-x-auto  max-h-[450px]">
              {/* <ScrollArea className=" rounded-md border p-4  "> */}
              <DataTable
                columns={columns}
                data={filterDataByDay(
                  data,
                  new Date()
                    .toLocaleString('en-US', { weekday: 'long' })
                    .toLowerCase()
                )}
              />
              {/* </ScrollArea> */}
            </div>
          </TabsContent>

          <TabsContent value="monday">
            <div className="overflow-x-auto  max-h-[450px]">
              {/* <ScrollArea className="h-[450px] rounded-md border p-4 "> */}
              <DataTable
                columns={columns}
                data={filterDataByDay(data, 'monday')}
              />
              {/* </ScrollArea> */}
            </div>
          </TabsContent>
          <TabsContent value="tuesday">
            <div className="overflow-x-auto  max-h-[450px]">
              {/* <ScrollArea className="h-[450px] rounded-md border p-4 "> */}
              <DataTable
                columns={columns}
                data={filterDataByDay(data, 'tuesday')}
              />
              {/* </ScrollArea> */}
            </div>
          </TabsContent>
          <TabsContent value="wednesday">
            <div className="overflow-x-auto  max-h-[450px]">
              {/* <ScrollArea className="h-[450px] rounded-md border p-4 "> */}
              <DataTable
                columns={columns}
                data={filterDataByDay(data, 'wednesday')}
              />
              {/* </ScrollArea> */}
            </div>
          </TabsContent>
          <TabsContent value="thursday">
            <div className="overflow-x-auto  max-h-[450px]">
              {/* <ScrollArea className="h-[450px] rounded-md border p-4 "> */}
              <DataTable
                columns={columns}
                data={filterDataByDay(data, 'thursday')}
              />
              {/* </ScrollArea> */}
            </div>
          </TabsContent>
          <TabsContent value="friday">
            <div className="overflow-x-auto  max-h-[450px]">
              {/* <ScrollArea className="h-[450px] rounded-md border p-4 "> */}
              <DataTable
                columns={columns}
                data={filterDataByDay(data, 'friday')}
              />
              {/* </ScrollArea> */}
            </div>
          </TabsContent>
          <TabsContent value="all">
            <div className="overflow-x-auto  max-h-[450px]">
              {/* <ScrollArea className="h-[450px] rounded-md border p-4 "> */}
              <DataTable columns={columns} data={data} />
              {/* </ScrollArea> */}
            </div>
          </TabsContent>
          {/* <ScrollArea className="h-[450px] rounded-md border p-4 ">
          <DataTable columns={columns} data={data} />
        </ScrollArea> */}
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default NewsComponent;
