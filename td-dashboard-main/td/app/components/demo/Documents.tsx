import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/components/ui/sheet';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/app/components/ui/hover-card';
import { Skeleton } from '@/app/components/ui/skeleton';

import { useUser } from '@/app/appwrite/useUser';
import {
  fetchSingleMDXDocument,
  getAllMDXDocuments,
  createNewMDXDocument,
} from '@/app/appwrite/services/MDXDocumentService';
import MarkdownEditor from './MarkdownEditor';
import LoadingScreen from '../loading/LoadingScreen';
import { Document } from 'cheerio';

interface MDXDocument {
  userId: string;
  documentId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function DocumentList() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<MDXDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<MDXDocument | null>(
    null
  );

  const [isLoadingDocument, setIsLoadingDocument] = useState(false);

  const openDocument = async (doc: MDXDocument) => {
    setIsLoadingDocument(true);
    const fetchedDocuments = await getAllMDXDocuments(user.$id);
    console.log(doc.content);
    const parsedContent = doc.content;
    // console.log(doc.content);
    setSelectedDocument({
      ...fetchedDocuments,
      content: parsedContent,
      documentId: doc.documentId,
      userId: '',
      title: '',
      createdAt: '',
      updatedAt: '',
    });
    setIsLoadingDocument(false);
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      const fetchedDocuments = await getAllMDXDocuments(user.$id);
      console.log(fetchedDocuments);
      setDocuments(fetchedDocuments);
      setIsLoading(false);
    };

    fetchDocuments();
  }, [user]);

  const handleNewDocumentClick = async () => {
    const newDocumentId = await createNewMDXDocument(
      user.$id,
      'Untitled Document',
      ``
    );

    const fetchedDocuments = await getAllMDXDocuments(user.$id);
    setDocuments(fetchedDocuments);
  };

  return (
    <div className="p-4">
      <Button
        variant="outline"
        className="mb-4"
        onClick={handleNewDocumentClick}
      >
        New Document
      </Button>

      {isLoading ? (
        <SkeletonDemo />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <HoverCard key={doc.documentId}>
              <HoverCardTrigger>
                <Card>
                  <CardHeader>
                    <CardTitle>{doc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Last edited: {doc.updatedAt}</p>
                  </CardContent>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" onClick={() => openDocument(doc)}>
                      Open
                    </Button>
                  </SheetTrigger>
                  <SheetContent size="full">
                    <SheetHeader>
                      <SheetTitle>Your Current Document</SheetTitle>
                      <SheetDescription>
                        {isLoadingDocument ? (
                          <LoadingScreen />
                        ) : (
                          <MarkdownEditor
                            initialContents={selectedDocument?.content ?? null}
                            selectedDocument={selectedDocument ?? null}
                          />
                        )}
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>

                <Button variant="outline" onClick={() => openDocument(doc)}>
                  Share
                </Button>
                <Button variant="outline" onClick={() => openDocument(doc)}>
                  Delete
                </Button>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonDemo() {
  return (
    <div className="flex flex-wrap items-center space-x-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-full sm:w-1/2 md:w-1/3 p-4">
          <Skeleton className="h-12 w-full rounded" />
          <Skeleton className="h-4 w-full mt-4" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </div>
      ))}
    </div>
  );
}
