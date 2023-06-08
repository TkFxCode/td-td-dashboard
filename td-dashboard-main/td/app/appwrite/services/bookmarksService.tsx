import { databases } from '@/app/appwrite/appwrite';

export const addOrUpdateBookmarks = async (
  userId: string,
  bookmarks: string[]
) => {
  let userDocument;

  try {
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_USER_BOOKMARKS_COLLECTION_ID) {
      throw new Error(
        'NEXT_PUBLIC_APPWRITE_USER_BOOKMARKS_COLLECTION_ID is not defined'
      );
    }
    userDocument = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_BOOKMARKS_COLLECTION_ID,
      userId
    );
  } catch (error) {
    console.log('User document does not exist:', error);
  }

  if (userDocument) {
    try {
      if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
        throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
      }
      if (!process.env.NEXT_PUBLIC_APPWRITE_USER_BOOKMARKS_COLLECTION_ID) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_USER_BOOKMARKS_COLLECTION_ID is not defined'
        );
      }
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_USER_BOOKMARKS_COLLECTION_ID,
        userId,

        {
          bookmarks: [...userDocument.bookmarks, ...bookmarks],
        }
      );
    } catch (error) {
      console.log('Error updating document:', error);
    }
  } else {
    try {
      if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
        throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
      }
      if (!process.env.NEXT_PUBLIC_APPWRITE_USER_BOOKMARKS_COLLECTION_ID) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_USER_BOOKMARKS_COLLECTION_ID is not defined'
        );
      }
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_USER_BOOKMARKS_COLLECTION_ID,
        `${userId}`,
        {
          bookmarks: bookmarks,
        }
      );
    } catch (error) {
      console.log('Error creating document:', error);
    }
  }
};
export const getUserBookmarks = async (userId: string) => {
  let userDocument;
  try {
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_USER_BOOKMARKS_COLLECTION_ID) {
      throw new Error(
        'NEXT_PUBLIC_APPWRITE_USER_BOOKMARKS_COLLECTION_ID is not defined'
      );
    }
    userDocument = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_BOOKMARKS_COLLECTION_ID,
      userId
    );
    return userDocument?.bookmarks || [];
  } catch (error) {
    console.log('Error getting user document:', error);
    return [];
  }
};
