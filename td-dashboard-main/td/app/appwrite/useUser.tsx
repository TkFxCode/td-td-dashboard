'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { account, databases, Query } from './appwrite';
import { useRouter } from 'next/navigation';

// Add a helper function to create the user document
const createUserDocument = async (
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  username: string,
  avatarUrl: string,
  phoneNumber: string,
  bio: string,
  country: string,
  cityState: string,
  postalCode: string
) => {
  try {
    const response = await databases.createDocument(
      '6456b05eb0764a873d05',
      '6456b066929fbb0247d3',
      `${userId}`,
      {
        userId: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        username: username,
        avatarUrl: avatarUrl,
        phoneNumber: phoneNumber,
        bio: bio,
        country: country,
        cityState: cityState,
        postalCode: postalCode,
      }
    );
    // console.log('User document created:', response);
  } catch (error) {
    console.error('User document creation failed:', error);
  }
};

export const createTask = async (
  userId: string,
  taskName: string,
  taskDescription: string,
  taskPriority: string,
  taskDate: string
) => {
  try {
    // Fetch the user document
    const userDoc = await getUserDocument(userId);
    const tasks = userDoc?.tasks || [];

    // Create a new task object and stringify it
    const newTask = JSON.stringify({
      id: `task-${Date.now()}`, // Generate a unique ID for the task based on the current timestamp
      userId: userId,
      taskName: taskName,
      taskDescription: taskDescription,
      taskPriority: taskPriority,
      taskDate: taskDate,
    });

    // Add the new task to the tasks array
    tasks.push(newTask);

    // Update the user document with the modified tasks array
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

// Add a helper function to fetch the user document by user ID
const getUserDocument = async (userId: string) => {
  try {
    const response = await databases.getDocument(
      '6456b05eb0764a873d05',
      '6456b066929fbb0247d3',
      userId
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch user document:', error);
  }
};

//Demo
//Demo
export const createNewMDXDocument = async (
  userId: string,
  title: string,
  content: string
) => {
  const documentData = {
    userId: userId,
    title: title,
    content: content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const response = await databases.createDocument(
      '6456b05eb0764a873d05',
      '645c420225d6302464fe',
      'unique()',
      documentData
    );
    console.log('New document created:', response);
    return response.$id;
  } catch (error) {
    console.error('Document creation failed:', error);
  }
};

// Add a helper function to fetch all documents MDX by user ID TESTESTETST
export const getAllMDXDocuments = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      '6456b05eb0764a873d05',
      '645c420225d6302464fe'
    );

    // map the response to fit the Document interface
    const documents = response.documents.map((doc) => ({
      userId: doc.userId,
      documentId: doc.$id,
      title: doc.title,
      content: doc.content,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    }));

    console.log(documents);
    return documents;
  } catch (error) {
    console.error('Failed to fetch all documents:', error);
    return []; // return an empty array in case of an error
  }
};

// Add a helper function to fetchh a single MDX document by document ID
export const fetchSingleMDXDocument = async (documentId: string) => {
  try {
    const response = await databases.getDocument(
      '6456b05eb0764a873d05',
      '645c420225d6302464fe',
      documentId
    );

    console.log(response);
    return response;
  } catch (error) {
    console.error('Task update failed:', error);
  }
};

// This function will update the document content in your database
export const updateMDXDocumentContent = async (
  documentId: string,
  content: string
) => {
  try {
    const response = await databases.updateDocument(
      '6456b05eb0764a873d05',
      '645c420225d6302464fe',
      documentId,
      {
        content: content,
      }
    );
    console.log('Document updated:', response);
  } catch (error) {
    console.log(documentId);
    console.error('Document update failed:', error);
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

//TradingAccounts
export const listTradeHistory = async (userId: string, apiKey: string) => {
  try {
    const response = await databases.listDocuments(
      '6456b05eb0764a873d05',
      '646fba38d877c98f969c',
      [Query.equal('AccountKey', apiKey)]
    );
    console.log(response);

    return response;
  } catch (error) {
    console.error('Failed to fetch trading account document:', error);
    return null;
  }
};

export const getallTradingAccountDocument = async (userId: string) => {
  try {
    const response = await databases.getDocument(
      '6456b05eb0764a873d05',
      '646f2225aa07cd89f076',
      userId
    );
    const accounts = [
      ...response['personal-accounts'],
      ...response['FTMO'],
      ...response['MyForexFunds'],
      ...response['MyFundedFx'],
      ...response['BespokeFunding'],
      ...response['TrueForexFunds'],
    ];
    return accounts;
  } catch (error) {
    console.error('Failed to fetch trading account document:', error);
    return [];
  }
};

// Add a helper function to fetch the user document by user ID
export const getTradingAccountDocument = async (userId: string) => {
  try {
    const response = await databases.getDocument(
      '6456b05eb0764a873d05',
      '646f2225aa07cd89f076',
      userId
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch trading account document:', error);
    return null;
  }
};

const createTradingAccountDocument = async (userId: string) => {
  try {
    const response = await databases.createDocument(
      '6456b05eb0764a873d05',
      '646f2225aa07cd89f076',
      `${userId}`,
      {
        UserId: userId,
        'personal-accounts': [],
        FTMO: [],
        MyForexFunds: [],
        MyFundedFx: [],
        BespokeFunding: [],
        TrueForexFunds: [],
      }
    );
    console.log('Trading account document created:', response);
    return response;
  } catch (error) {
    console.error('Trading account document creation failed:', error);
    return null;
  }
};

export const addTradingAccount = async (
  userId: string,
  propFirm: string,
  accountSize: string,
  accountPhase: string,
  shareURL: string
) => {
  try {
    let userDoc = await getTradingAccountDocument(userId);

    if (!userDoc) {
      userDoc = await createTradingAccountDocument(userId);
    }

    if (!userDoc) {
      console.error('Failed to fetch or create trading account document');
      return;
    }

    const updatedPropFirm = userDoc[propFirm] || [];
    updatedPropFirm.push(
      JSON.stringify({
        propFirm,
        shareURL,
        accountSize,
        accountPhase,
      })
    );

    const response = await databases.updateDocument(
      '6456b05eb0764a873d05',
      '646f2225aa07cd89f076',
      userId,
      {
        [propFirm]: updatedPropFirm,
      }
    );
    console.log('Trading account added:', response);

    // Extract the apiKey from the shareURL
    const apiKey = shareURL.split('https://app.trueforexfunds.com/share/')[1];

    // Call /api/trades/[apiKey] endpoint
    const apiResponse = await axios.get(`/api/trades/${apiKey}`);
    const tradingHistory = apiResponse.data;
    const tradingHistoryString = JSON.stringify(tradingHistory);

    // Create a new document with the response data

    const document = await databases.createDocument(
      '6456b05eb0764a873d05',
      '646fba38d877c98f969c',
      'unique()',
      { AccountKey: apiKey, TradingHistory: tradingHistoryString }
    );

    console.log('New document created:', document);
  } catch (error) {
    console.error('Trading account addition failed:', error);
  }
};

interface UserContextProps {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    username: string,
    avatarUrl: string,
    phoneNumber: string,
    bio: string,
    country: string,
    cityState: string,
    postalCode: string
  ) => Promise<void>;

  getUserDocument: (userId: string) => Promise<any>;
  editTask: (
    userId: string,
    taskId: string,
    updatedTask: {
      taskName: string;
      taskDescription: string;
      taskPriority: string;
      taskDate: string;
    }
  ) => Promise<void>;
  getAllMDXDocuments: (userId: string) => Promise<any>;
  fetchSingleMDXDocument: (documentId: string) => Promise<any>;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  getUserDocument: async () => null,
  editTask: async () => {},
  getAllMDXDocuments: async () => null,
  fetchSingleMDXDocument: async () => null,
});

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await account.get();
        setUser(response);
      } catch (error) {
        console.error('No valid session found');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await account.createEmailSession(email, password);
      const response = await account.get();
      setUser(response);
      router.push('/');
    } catch (error: any) {
      console.error('Login failed:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await account.deleteSession('current');
      setUser(null);
      router.push('/login');
    } catch (error: any) {
      console.error('Logout failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    username: string,
    avatarUrl: string,
    phoneNumber: string,
    bio: string,
    country: string,
    cityState: string,
    postalCode: string
  ) => {
    setLoading(true);
    try {
      const createResponse = await account.create(
        'unique()',
        email,
        password,
        `${firstName} ${lastName}`
      );
      const userId = createResponse.$id;
      await login(email, password);
      await createUserDocument(
        userId,
        email,
        firstName,
        lastName,
        username,
        avatarUrl,
        phoneNumber,
        bio,
        country,
        cityState,
        postalCode
      );
    } catch (error: any) {
      console.error('Signup failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        getUserDocument,
        editTask,
        getAllMDXDocuments,
        fetchSingleMDXDocument,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
