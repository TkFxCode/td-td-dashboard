import { databases } from '@/app/appwrite/appwrite';

export const addOrUpdateBookmarks = async (
  userId: string,
  bookmarks: string[]
) => {
  let userDocument;

  
  try {
    userDocument = await databases.getDocument(
      '6456b05eb0764a873d05',
      '647f42fe0a78123c732e',
      userId
    );
  } catch (error) {
    console.log('User document does not exist:', error);
  }

  
  if (userDocument) {
    try {
      await databases.updateDocument(
        '6456b05eb0764a873d05',
        '647f42fe0a78123c732e',
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
      await databases.createDocument(
        '6456b05eb0764a873d05',
        '647f42fe0a78123c732e',
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
    userDocument = await databases.getDocument(
      '6456b05eb0764a873d05',
      '647f42fe0a78123c732e',
      userId
    );
    return userDocument?.bookmarks || [];
  } catch (error) {
    console.log('Error getting user document:', error);
    return [];
  }
};
