'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { account, databases } from './appwrite';
import { useRouter } from 'next/navigation';

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
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID is not defined');
    }
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
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
    console.log('User Created Successfully:', response);
  } catch (error) {
    console.error('User document creation failed:', error);
  }
};
interface UserDocument {
  username?: string;
  email?: string;
  $id?: string;
  tasks?: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  country?: string;
  cityState?: string;
  postalCode?: string;
}

export const updateUserDocument = async (
  userId: string,
  data: any
): Promise<UserDocument | null> => {
  try {
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
      data
    );
    return response || null;
  } catch (error) {
    console.error('Failed to update user document:', error);
    return null;
  }
};

export const getUserDocument = async (userId: string) => {
  try {
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID is not defined');
    }
    const response = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
      userId
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch user document:', error);
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
}

const UserContext = createContext<UserContextProps>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  getUserDocument: async () => null,
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
