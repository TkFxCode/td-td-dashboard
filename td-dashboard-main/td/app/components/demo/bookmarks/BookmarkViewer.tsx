import React, { useEffect, useState } from 'react';
import { DataTable } from './table/date-table';
import { columns } from './table/columns';
import { getUserBookmarks } from '@/app/appwrite/services/bookmarksService';
import { Card } from '../../ui/card';

interface BookmarkViewerProps {
  userId: string;
  refresh: boolean;
}

const BookmarkViewer: React.FC<BookmarkViewerProps> = ({ userId, refresh }) => {
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
      tags: tags.replace(/\s*,\s*/g, ', '), // replaces multiple spaces with a single space
      url,
      image,
    };
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      const userBookmarks = await getUserBookmarks(userId);
      const parsedBookmarks = userBookmarks.map(parseBookmark);
      //console.log(parsedBookmarks);
      setBookmarks(parsedBookmarks);
    };

    fetchBookmarks();
  }, [userId, refresh]);

  return (
    <Card className="w-full mx-auto py-5">
      <DataTable columns={columns} data={bookmarks} />
    </Card>
  );
};

export default BookmarkViewer;
