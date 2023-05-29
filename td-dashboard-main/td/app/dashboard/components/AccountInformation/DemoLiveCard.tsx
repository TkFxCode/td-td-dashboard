import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';

const DemoLiveCard = () => {
  return (
    <>
      <Card>
        <CardHeader className="flex justify-between items-center px-5 py-3  border-b">
          <CardTitle className="text-lg font-semibold ">
            Prop Firm Name
          </CardTitle>
          <CardTitle className="text-sm ">
            Trading Account Number: 654321
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <Label htmlFor="startdate" className="font-medium ">
            Start Date: 2023-05-01
          </Label>
          <Label htmlFor="nextpayout" className="font-medium ">
            Next Payout Date: 2023-06-01
          </Label>
          <Label htmlFor="profitsplit" className="font-medium ">
            Current Profit Split: $ 1,389
          </Label>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex justify-between items-center px-5 py-3 border-b">
          <CardTitle className="text-lg font-semibold ">
            Prop Firm Name
          </CardTitle>
          <CardTitle className="text-sm ">
            Trading Account Number: 654321
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <Label htmlFor="startdate" className="font-medium ">
            Start Date: 2023-05-01
          </Label>
          <Label htmlFor="nextpayout" className="font-medium ">
            Next Payout Date: 2023-06-01
          </Label>
          <Label htmlFor="profitsplit" className="font-medium ">
            Current Profit Split: 50%
          </Label>
        </CardContent>
      </Card>
    </>
  );
};

export default DemoLiveCard;
