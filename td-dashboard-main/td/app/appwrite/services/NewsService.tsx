import { databases, Permission, Role } from '@/app/appwrite/appwrite';

export const createOrUpdateNewsDocument = async () => {
  const fetchNewsData = async () => {
    const response = await fetch('/api/news/');
    const data = await response.json();
    return data.events;
  };

  let result;
  let newsData;
  try {
    let document;
    try {
      if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
        throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
      }
      if (!process.env.NEXT_PUBLIC_APPWRITE_NEWS_COLLECTION_ID) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_NEWS_COLLECTION_ID is not defined'
        );
      }
      if (!process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_NEWS_DOCUMENT_ID) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_PUBLIC_NEWS_DOCUMENT_ID is not defined'
        );
      }
      document = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_NEWS_COLLECTION_ID,
        process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_NEWS_DOCUMENT_ID
      );
    } catch (error) {
      console.log('Document does not exist yet:', error);
    }
    const currentDate = new Date();

    if (document) {
      const lastUpdated = new Date(document.lastUpdated);
      const timeDifference = currentDate.getTime() - lastUpdated.getTime();
      const differenceInHours = Math.floor(timeDifference / 1000 / 60 / 60);
      if (differenceInHours >= 24) {
        newsData = await fetchNewsData();
        console.log('News data fetched:', newsData);
        if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
          throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
        }
        if (!process.env.NEXT_PUBLIC_APPWRITE_NEWS_COLLECTION_ID) {
          throw new Error(
            'NEXT_PUBLIC_APPWRITE_NEWS_COLLECTION_ID is not defined'
          );
        }
        if (!process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_NEWS_DOCUMENT_ID) {
          throw new Error(
            'NEXT_PUBLIC_APPWRITE_PUBLIC_NEWS_DOCUMENT_ID is not defined'
          );
        }
        result = await databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_NEWS_COLLECTION_ID,
          process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_NEWS_DOCUMENT_ID,
          {
            news: JSON.stringify(newsData),
            lastUpdated: currentDate,
          },
          [Permission.read(Role.any())]
        );
        console.log('News data updated:', result);
      } else {
        console.log('News data is up to date. Not fetching new data.');
        newsData = JSON.parse(document.news);
      }
    } else {
      if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
        throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
      }
      if (!process.env.NEXT_PUBLIC_APPWRITE_NEWS_COLLECTION_ID) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_NEWS_COLLECTION_ID is not defined'
        );
      }
      if (!process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_NEWS_DOCUMENT_ID) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_PUBLIC_NEWS_DOCUMENT_ID is not defined'
        );
      }
      newsData = await fetchNewsData();
      console.log('News data fetched:', newsData);
      result = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_NEWS_COLLECTION_ID,
        process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_NEWS_DOCUMENT_ID,
        {
          news: JSON.stringify(newsData),
          lastUpdated: currentDate,
        },
        [Permission.read(Role.any())]
      );
      console.log('News data created:', result);
    }
  } catch (error) {
    console.error('News data fetch or update failed:', error);
  }
  console.log('Final News Data', newsData);
  return newsData;
};

export const getUserNewsDocument = async (userId: string) => {
  try {
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_USER_NEWS_COLLECTION_ID) {
      throw new Error(
        'NEXT_PUBLIC_APPWRITE_USER_NEWS_COLLECTION_ID is not defined'
      );
    }
    const userDoc = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_NEWS_COLLECTION_ID,
      userId
    );
    console.log('User news document fetched:', userDoc);
    return userDoc;
  } catch (error) {
    console.error('Failed to fetch user news document:', error);
    return null;
  }
};

export const createOrUpdateUserNewsDocument = async (
  userId: string,
  newsEvents: any[]
) => {
  try {
    let userDoc = await getUserNewsDocument(userId);

    if (userDoc) {
      const currentUserNews = userDoc.userNews || [];
      const currentUserNewsParsed = JSON.parse(currentUserNews);
      const updatedUserNews = [...currentUserNewsParsed, ...newsEvents];
      if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
        throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
      }
      if (!process.env.NEXT_PUBLIC_APPWRITE_USER_NEWS_COLLECTION_ID) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_USER_NEWS_COLLECTION_ID is not defined'
        );
      }
      const response = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_USER_NEWS_COLLECTION_ID,
        userId,
        {
          userNews: JSON.stringify(updatedUserNews),
        }
      );
      console.log('User news document updated:', response);
      return response;
    } else {
      if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
        throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
      }
      if (!process.env.NEXT_PUBLIC_APPWRITE_USER_NEWS_COLLECTION_ID) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_USER_NEWS_COLLECTION_ID is not defined'
        );
      }
      const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_USER_NEWS_COLLECTION_ID,
        userId,
        {
          userId: userId,
          userNews: JSON.stringify(newsEvents),
        }
      );
      console.log('User news document created:', response);
      return response;
    }
  } catch (error) {
    console.error('Failed to create or update user news document:', error);
    return null;
  }
};
export const removeNewsFromUserDocument = async (
  userId: string,
  newsEvent: { title: string }
) => {
  try {
    let userDoc = await getUserNewsDocument(userId);

    if (userDoc) {
      const currentUserNews = JSON.parse(userDoc.userNews || '[]');
      const updatedUserNews = currentUserNews.filter(
        (news: { title: string }) => {
          return news.title !== newsEvent.title;
        }
      );
      if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
        throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
      }
      if (!process.env.NEXT_PUBLIC_APPWRITE_USER_NEWS_COLLECTION_ID) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_USER_NEWS_COLLECTION_ID is not defined'
        );
      }
      const response = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_USER_NEWS_COLLECTION_ID,
        userId,
        {
          userNews: JSON.stringify(updatedUserNews),
        }
      );

      console.log('User news document updated:', response);
      return response;
    }
  } catch (error) {
    console.error('Failed to remove news from user document:', error);
    return null;
  }
};
