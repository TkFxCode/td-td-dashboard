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

    const response = await databases.updateDocument(
      '6456b05eb0764a873d05',
      '6456b066929fbb0247d3',
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

      const response = await databases.updateDocument(
        '6456b05eb0764a873d05',
        '6456b066929fbb0247d3',
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

      const response = await databases.updateDocument(
        '6456b05eb0764a873d05',
        '6456b066929fbb0247d3',
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
