import React from 'react';
import { useUser, getAllMDXDocuments } from '@/app/appwrite/useUser';
import { useState, useEffect } from 'react';
import TaskCreate from '../demo/taskCreate';
import TaskList from '@/app/components/reusable/TaskList/TaskList';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/app/components/ui/card';
import LoadingScreen from '@/app/components/loading/LoadingScreen';

interface Task {
  id: string;
  taskName: string;
  taskDescription: string;
  topic: string;
  date: string;
}

const TasksTab = () => {
  const { user, logout, getUserDocument } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const tasks = userData?.tasks
    ? userData.tasks.map((task: string) => JSON.parse(task) as Task)
    : [];
  const [loading, setLoading] = useState<boolean>(true);

  const handleTaskCreated = async () => {
    if (user) {
      const document = await getUserDocument(user.$id);
      setUserData(document);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true); // Set loading to true while fetching data
        const document = await getUserDocument(user.$id);
        setUserData(document);
        setLoading(false); // Set loading to false after data has been fetched
      }
    };

    fetchData();
  }, [user, getUserDocument]);

  return (
    <div className="w-full h-full">
      <Card className="flex flex-col h-auto w-full ">
        <CardHeader>Tasks and Wellness</CardHeader>
        <CardContent>
          <Card>
            <CardTitle>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl text-center py-20">
                {`All ${user?.name}'s Tasks`}
              </h1>
            </CardTitle>
            <CardHeader className="grid gap-6 justify-end">
              <div>
                <TaskCreate onTaskCreated={handleTaskCreated} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? ( // Display LoadingScreen while loading is true
                <LoadingScreen />
              ) : (
                // Display TaskList once loading is false
                <TaskList tasks={tasks} />
              )}
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default TasksTab;
