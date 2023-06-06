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
      document = await databases.getDocument(
        '6456b05eb0764a873d05',
        '647c8d2c22ed38ed07b0',
        '243n2b45b4n23n4b543n'
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
        result = await databases.updateDocument(
          '6456b05eb0764a873d05',
          '647c8d2c22ed38ed07b0',
          '243n2b45b4n23n4b543n',
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
      newsData = await fetchNewsData();
      console.log('News data fetched:', newsData);
      result = await databases.createDocument(
        '6456b05eb0764a873d05',
        '647c8d2c22ed38ed07b0',
        '243n2b45b4n23n4b543n',
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
    const userDoc = await databases.getDocument(
      '6456b05eb0764a873d05',
      '647de75c02a0dab2c148',
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
      const response = await databases.updateDocument(
        '6456b05eb0764a873d05',
        '647de75c02a0dab2c148',
        userId,
        {
          userNews: JSON.stringify(updatedUserNews),
        }
      );
      console.log('User news document updated:', response);
      return response;
    } else {
      const response = await databases.createDocument(
        '6456b05eb0764a873d05',
        '647de75c02a0dab2c148',
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

      const response = await databases.updateDocument(
        '6456b05eb0764a873d05',
        '647de75c02a0dab2c148',
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
