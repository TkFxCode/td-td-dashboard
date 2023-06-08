import { databases } from '@/app/appwrite/appwrite';
import { getUserDocument } from '@/app/appwrite/useUser';

export const createTask = async (
  userId: string,
  taskName: string,
  taskDescription: string,
  taskPriority: string,
  taskDate: string
) => {
  try {
    const userDoc = await getUserDocument(userId);
    const tasks = userDoc?.tasks || [];

    const newTask = JSON.stringify({
      id: `task-${Date.now()}`,
      userId: userId,
      taskName: taskName,
      taskDescription: taskDescription,
      taskPriority: taskPriority,
      taskDate: taskDate,
      completed: false,
    });

    tasks.push(newTask);
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID is not defined');
    }
    const response = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
      userId,
      {
        tasks: tasks,
      }
    );
    console.log('Task added:', response);
  } catch (error) {
    console.error('Task addition failed:', error);
  }
};

export const editTask = async (
  userId: string,
  taskId: string,
  updatedTask: {
    taskName: string;
    taskDescription: string;
    taskPriority: string;
    taskDate: string;
  }
) => {
  try {
    const userDoc = await getUserDocument(userId);
    const tasks = userDoc?.tasks || [];

    const taskIndex = tasks.findIndex(
      (task: any) => JSON.parse(task).id === taskId
    );
    if (taskIndex !== -1) {
      tasks[taskIndex] = JSON.stringify({
        id: taskId,
        userId: userId,
        ...updatedTask,
      });
      if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
        throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
      }
      if (!process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID is not defined'
        );
      }
      const response = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
        userId,
        {
          tasks: tasks,
        }
      );
      console.log('Task updated:', response);
    } else {
      console.error('Task not found');
    }
  } catch (error) {
    console.error('Task update failed:', error);
  }
};
export const completeTask = async (userId: string, taskId: string) => {
  try {
    const userDoc = await getUserDocument(userId);
    const tasks = userDoc?.tasks || [];

    const taskIndex = tasks.findIndex(
      (task: any) => JSON.parse(task).id === taskId
    );
    if (taskIndex !== -1) {
      const task = JSON.parse(tasks[taskIndex]);
      task.completed = true;
      tasks[taskIndex] = JSON.stringify(task);
      if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
        throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
      }
      if (!process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID is not defined'
        );
      }
      const response = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
        userId,
        {
          tasks: tasks,
        }
      );
      console.log('Task marked as complete:', response);
    } else {
      console.error('Task not found');
    }
  } catch (error) {
    console.error('Task completion failed:', error);
  }
};
