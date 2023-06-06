import React from 'react';
import { useUser } from '@/app/appwrite/useUser';
import { getAllMDXDocuments } from '@/app/appwrite/services/MDXDocumentService';
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
  completed: boolean;
}

const TasksTab = () => {
  const { user, logout, getUserDocument } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const tasks = userData?.tasks
    ? userData.tasks
        .map((task: string) => JSON.parse(task) as Task)
        .filter((task: Task) => !task.completed)
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
        setLoading(true);
        const document = await getUserDocument(user.$id);
        setUserData(document);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, getUserDocument]);

  const handleTaskUpdated = async () => {
    if (user) {
      const document = await getUserDocument(user.$id);
      setUserData(document);
    }
  };

  return (
    <div className="w-full h-full">
      <Card className="flex flex-col h-auto w-full ">
        <CardHeader>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Tasks
          </h1>
        </CardHeader>
        <CardContent>
          <Card>
            <CardTitle>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl text-center py-20">
                {`All ${user?.name}'s Tasks`}
              </h1>
            </CardTitle>
            <CardHeader className="flex flex-row justify-between">
              <div>
                <h2 className="scroll-m-20  text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                  Your Task List
                </h2>
              </div>
              <div>
                <TaskCreate onTaskCreated={handleTaskCreated} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingScreen />
              ) : (
                <TaskList tasks={tasks} onTaskUpdated={handleTaskUpdated} />
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
