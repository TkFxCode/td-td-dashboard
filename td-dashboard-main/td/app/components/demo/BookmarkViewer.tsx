import React, { useEffect, useState } from 'react';
import { DataTable } from './bookmarks/table/date-table';
import { columns } from './bookmarks/table/columns';
import { getUserBookmarks } from '@/app/appwrite/services/bookmarksService';
import { Card } from '../ui/card';

interface BookmarkViewerProps {
  userId: string;
}

const BookmarkViewer: React.FC<BookmarkViewerProps> = ({ userId }) => {
  const [bookmarks, setBookmarks] = useState([]);

  const parseBookmark = (bookmarkStr: string) => {
    const title = bookmarkStr.match(/Title : ([^\n]+)/)?.[1] || 'N/A';
    const description =
      bookmarkStr.match(/Description : ([^\n]+)/)?.[1] || 'N/A';
    const tags = bookmarkStr.match(/Tags : ([^\n]+)/)?.[1] || 'N/A';
    const url = bookmarkStr.match(/URL : ([^\n]+)/)?.[1] || 'N/A';
    const image = bookmarkStr.match(/Image : ([^\n]+)/)?.[1] || 'N/A';

    return {
      title,
      description,
      tags: tags.split(','),
      url,
      image,
    };
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      const userBookmarks = await getUserBookmarks(userId);
      const parsedBookmarks = userBookmarks.map(parseBookmark);
      console.log(parsedBookmarks);
      setBookmarks(parsedBookmarks);
    };

    fetchBookmarks();
  }, [userId]);

  return (
    <Card className="w-full mx-auto py-5">
      <DataTable columns={columns} data={bookmarks} />
    </Card>
  );
};

export default BookmarkViewer;
