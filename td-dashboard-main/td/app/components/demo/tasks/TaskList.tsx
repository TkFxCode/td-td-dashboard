import React from 'react';
import { Check } from 'lucide-react';
import { useUser } from '@/app/appwrite/useUser';
import { editTask } from '@/app/appwrite/services/taskService';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { cn } from '@/lib/utils';
import { addDays, format } from 'date-fns';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Calendar } from '@/app/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Settings2 } from 'lucide-react';
import { CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { completeTask } from '@/app/appwrite/services/taskService';
interface Task {
  id: string;
  taskName: string;
  taskDescription: string;
  taskPriority: string;
  taskDate: string;
}

const TaskList = ({
  tasks,
  onTaskUpdated,
}: {
  tasks: Task[];
  onTaskUpdated: () => void;
}) => {
  const { user } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const router = useRouter();

  const handleEditSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    taskId: string
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const updatedTask: Task = {
      id: taskId,
      taskName: formData.get('taskName') as string,
      taskDescription: formData.get('taskDescription') as string,
      taskPriority: formData.get('taskPriority') as string,
      taskDate: date ? date.toISOString() : '',
    };

    if (user) {
      try {
        await editTask(user.$id, taskId, updatedTask);
      } catch (error) {
        console.error('Error editing task:', error);
      }
    } else {
      alert('You must be logged in to edit a task');
    }
  };

  return (
    <div className="space-y-1 ">
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ x: -10000 }}
            animate={{ x: 0 }}
            exit={{ x: 1000 }}
            transition={{ delay: index * 0.5 }}
          >
            <div
              key={task.id}
              className={`flex flex-col lg:flex-row items-start lg:items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 `}
            >
              <Avatar className="h-9 w-9 text-green-500 mr-4 mb-2 lg:mb-0 hover:scale-110 transition-transform duration-300 ease-in-out hover:-rotate-12">
                <AvatarImage src="/AvatarTask.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {/* <Check className="h-9 w-9 text-green-500 mr-4 mb-2 lg:mb-0" /> */}
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {task.taskName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {task.taskDescription}
                </p>
              </div>
              <div className="mt-4 lg:mt-0 lg:ml-auto font-medium flex justify-between items-center">
                <div className="mr-4">
                  <Badge
                    variant="secondary"
                    style={{ height: 'auto', margin: '2px' }}
                  >
                    Priority: {task.taskPriority}
                  </Badge>
                </div>
                <div>
                  <Badge style={{ height: 'auto', margin: '2px' }}>
                    Date: {new Date(task.taskDate).toLocaleString()}
                  </Badge>
                </div>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-10 rounded-full p-0 ml-5"
                  >
                    <Settings2 className="h-4 w-4" />
                    <span className="sr-only">Open popover</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full">
                  <form onSubmit={(e) => handleEditSubmit(e, task.id)}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="taskName">Task Name</Label>
                        <Input
                          id="taskName"
                          name="taskName"
                          defaultValue={task.taskName}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="taskDescription">
                          Task Description
                        </Label>
                        <Input
                          id="taskDescription"
                          name="taskDescription"
                          defaultValue={task.taskDescription}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="taskPriority">Priority</Label>
                        <Select
                          name="taskPriority"
                          defaultValue={task.taskPriority}
                        >
                          <SelectTrigger id="taskPriority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
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
                              {date ? (
                                format(date, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
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
                                selected={
                                  task.taskDate ? new Date(task.taskDate) : date
                                }
                                onSelect={setDate}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                className=" rounded-full p-2 ml-5"
                onClick={async () => {
                  if (user) {
                    await completeTask(user.$id, task.id);
                    onTaskUpdated();
                  }
                }}
              >
                <Check className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
