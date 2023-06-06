import { ColumnDef } from '@tanstack/react-table';
import { Link, MoreHorizontal, Touchpad } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/app/components/ui/hover-card';

export type Data = {
  title: string;
  description: string;
  tags: string[];
  url: string;
  image: string;
};

export const columns: ColumnDef<Data>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.getValue('tags') as string[];
      return <div>{tags.join(', ')}</div>;
    },
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => {
      const url = row.getValue('url') as string;
      return (
        <Button variant="ghost" onClick={() => window.open(url, '_blank')}>
          <Link className="mr-2 h-4 w-4" />
          Open
        </Button>
      );
    },
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const image = row.getValue('image') as string;
      return image === 'N/A' ? (
        'N/A'
      ) : (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">
              <Touchpad className="mr-2 h-4 w-4" />
              View Image
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto max-w-[450px]">
            <img src={image} alt="Data" />
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
];
