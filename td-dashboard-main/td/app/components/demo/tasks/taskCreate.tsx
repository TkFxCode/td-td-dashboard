import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Calendar } from '@/app/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/components/ui/sheet';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import {
  TbCircle1Filled,
  TbCircle2Filled,
  TbCircle3Filled,
} from 'react-icons/tb';
import { cn } from '@/lib/utils';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Terminal, Waves } from 'lucide-react';
import { useUser } from '@/app/appwrite/useUser';
import { createTask } from '@/app/appwrite/services/taskService';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { useToast } from '../../ui/use-toast';

interface TaskCreateProps {
  onTaskCreated: () => void;
}

const TaskCreate: React.FC<TaskCreateProps> = ({ onTaskCreated }) => {
  const { user } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append('taskDate', date?.toISOString() ?? '');

    const data = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, String(value)])
    );

    console.log(data);

    if (!data.taskName || !data.taskDescription || !data.taskPriority) {
      alert('Task must have a title, description, and priority');
      return;
    }

    if (user) {
      try {
        await createTask(
          user.$id,
          data.taskName,
          data.taskDescription,
          data.taskPriority,
          data.taskDate
        );
        toast({
          title: 'Heads Up!',
          description: 'Task Added Successfully',
        });
        onTaskCreated();
      } catch (error) {
        alert('Error adding task');
        console.error('Error adding task:', error);
      }
    } else {
      alert('You must be logged in to add a task');
    }
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button>Create Task</Button>
        </SheetTrigger>
        <SheetContent position="right" size="content">
          <form onSubmit={handleSubmit}>
            <SheetHeader>
              <SheetTitle>Create a new task</SheetTitle>
              <SheetDescription>Fill in the task details</SheetDescription>
            </SheetHeader>
            <Card>
              <CardHeader>
                <CardTitle>Create a new task</CardTitle>
                <CardDescription>Fill in the task details</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="taskName">Task Name</Label>
                  <Input
                    id="taskName"
                    name="taskName"
                    placeholder="Enter task name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taskDescription">Task Description</Label>
                  <Textarea
                    id="taskDescription"
                    name="taskDescription"
                    placeholder="Enter task description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taskPriority">Priority</Label>
                  <Select name="taskPriority">
                    <SelectTrigger id="taskPriority">
                      <SelectValue placeholder="Select Task Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">
                        <TbCircle1Filled className="mr-2 h-4 w-4" />
                        Low
                      </SelectItem>
                      <SelectItem value="Medium">
                        <TbCircle2Filled className="mr-2 h-4 w-4" />
                        Medium
                      </SelectItem>
                      <SelectItem value="High">
                        <TbCircle3Filled className="mr-2 h-4 w-4" />
                        High
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[280px] justify-start text-left font-normal',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                      <Select
                        onValueChange={(value) =>
                          setDate(addDays(new Date(), parseInt(value)))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="0">Today</SelectItem>
                          <SelectItem value="1">Tomorrow</SelectItem>
                          <SelectItem value="3">In 3 days</SelectItem>
                          <SelectItem value="7">In a week</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="rounded-md border">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Create Task
                </Button>
              </CardFooter>
            </Card>
          </form>
          <SheetFooter></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TaskCreate;
