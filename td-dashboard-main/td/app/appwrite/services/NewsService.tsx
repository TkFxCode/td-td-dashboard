import { databases, Permission, Role } from '@/app/appwrite/appwrite';

// Main function to create or update document
export const createOrUpdateNewsDocument = async () => {
  // Function to fetch news data
  const fetchNewsData = async () => {
    const response = await fetch('/api/news/');
    const data = await response.json();
    return data.events;
  };

  let result;
  let newsData;
  try {
    // Check if document exists
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
    // Create or update the document based on existence
    if (document) {
      // Document exists, check if it's older than 24 hours
      const lastUpdated = new Date(document.lastUpdated); // Use your manually stored 'lastUpdated' field
      const timeDifference = currentDate.getTime() - lastUpdated.getTime();
      const differenceInHours = Math.floor(timeDifference / 1000 / 60 / 60);
      if (differenceInHours >= 24) {
        // Data is older than 24 hours, fetch new data and update document
        newsData = await fetchNewsData();
        console.log('News data fetched:', newsData);
        result = await databases.updateDocument(
          '6456b05eb0764a873d05',
          '647c8d2c22ed38ed07b0',
          '243n2b45b4n23n4b543n',
          {
            news: JSON.stringify(newsData),
            lastUpdated: currentDate, // Store as Date object directly
          },
          [Permission.read(Role.any())] // Anyone can view this document
        );
        console.log('News data updated:', result);
      } else {
        console.log('News data is up to date. Not fetching new data.');
        newsData = JSON.parse(document.news);
      }
    } else {
      // Document does not exist, fetch new data and create it
      newsData = await fetchNewsData();
      console.log('News data fetched:', newsData);
      result = await databases.createDocument(
        '6456b05eb0764a873d05',
        '647c8d2c22ed38ed07b0',
        '243n2b45b4n23n4b543n',
        {
          news: JSON.stringify(newsData),
          lastUpdated: currentDate, // Store as Date object directly
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
