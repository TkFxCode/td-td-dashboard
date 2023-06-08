import { useState, useEffect, FormEvent } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

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
  deleteMDXDocument,
} from '@/app/appwrite/services/MDXDocumentService';
import MarkdownEditor from './MarkdownEditor';
import LoadingScreen from '../../loading/LoadingScreen';
import { Input } from '../../ui/input';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

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
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(
    null
  );
  const [newDocumentTitle, setNewDocumentTitle] = useState('');

  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [showMarkdownEditor, setShowMarkdownEditor] = useState(false);

  const openDocument = async (doc: MDXDocument) => {
    setIsLoadingDocument(true);
    const fetchedDocuments = await getAllMDXDocuments(user.$id);
    const parsedContent = doc.content;
    setSelectedDocument({
      ...fetchedDocuments,
      content: parsedContent,
      documentId: doc.documentId,
      userId: '',
      title: '',
      createdAt: '',
      updatedAt: '',
    });
    setCurrentDocumentId(doc.documentId);
    setIsLoadingDocument(false);
    setShowMarkdownEditor(true);
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

  const handleNewDocumentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newDocumentTitle.trim() === '') {
      alert("Document title can't be empty!");
      return;
    }

    const newDocumentId = await createNewMDXDocument(
      user.$id,
      newDocumentTitle,
      ``
    );

    setNewDocumentTitle('');

    const fetchedDocuments = await getAllMDXDocuments(user.$id);
    setDocuments(fetchedDocuments);
  };
  const deleteDocument = async (doc: MDXDocument) => {
    try {
      await deleteMDXDocument(doc.documentId);

      const fetchedDocuments = await getAllMDXDocuments(user.$id);
      setDocuments(fetchedDocuments);

      if (doc.documentId === currentDocumentId) {
        setSelectedDocument(null);
        setShowMarkdownEditor(false);
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };
  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <form
              onSubmit={handleNewDocumentSubmit}
              className="flex flex-row gap-3"
            >
              <Input
                className="max-w-[350px]"
                type="text"
                value={newDocumentTitle}
                onChange={(e) => setNewDocumentTitle(e.target.value)}
                placeholder="Enter document title"
              />
              <Button type="submit">Create</Button>
            </form>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonDemo />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Card key={doc.documentId}>
                  <CardHeader>
                    <CardTitle>{doc.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-row flex justify-between">
                    <div>
                      <p>Last edited: {formatDate(doc.updatedAt)}</p>
                    </div>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <MoreVertical className="h-5 w-5 " />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => openDocument(doc)}>
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteDocument(doc)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        <Card className="m-2">
          <CardHeader>
            <CardTitle>Edit your Document Here</CardTitle>
          </CardHeader>
          <CardContent>
            {currentDocumentId && showMarkdownEditor ? (
              isLoadingDocument ? (
                <LoadingScreen />
              ) : (
                <Card className="mt-5 ">
                  <CardHeader>
                    <CardTitle>Edit your Selected Document</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MarkdownEditor
                      initialContents={selectedDocument?.content ?? null}
                      selectedDocument={selectedDocument ?? null}
                      clearSelectedDocument={() => {
                        setSelectedDocument(null);
                        setShowMarkdownEditor(false);
                      }}
                    />
                  </CardContent>
                </Card>
              )
            ) : (
              <>
                <p>No Document Selected</p>
              </>
            )}
          </CardContent>
        </Card>
      </Card>
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
