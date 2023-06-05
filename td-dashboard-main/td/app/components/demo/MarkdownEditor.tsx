import { BlockNoteEditor } from '@blocknote/core';
import {
  BlockNoteView,
  ToggledStyleButton,
  Toolbar,
  ToolbarButton,
  BlockTypeDropdown,
  TextAlignButton,
  ColorStyleButton,
  NestBlockButton,
  CreateLinkButton,
  useBlockNote,
} from '@blocknote/react';
import '@blocknote/core/style.css';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardHeader,
  CardDescription,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useEffect } from 'react';
import { updateMDXDocumentContent } from '@/app/appwrite/services/MDXDocumentService';
type ToolbarProps = {
  editor: BlockNoteEditor;
};
interface MDXDocument {
  userId: string;
  documentId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
type Props = {
  initialContents: string | null;
  selectedDocument: MDXDocument | null;
};

const MarkdownEditor: React.FC<Props> = ({
  initialContents,
  selectedDocument,
}) => {
  const editor: BlockNoteEditor | null = useBlockNote({
    initialContent: initialContents ? JSON.parse(initialContents) : undefined,
    onEditorContentChange: (editor) => {
      localStorage.setItem(
        'editorContent',
        JSON.stringify(editor.topLevelBlocks)
      );
    },
  });

  if (!editor) return null;

  const saveDocument = async () => {
    if (selectedDocument) {
      const contentString = JSON.stringify(editor.topLevelBlocks);
      const DatabaseId = selectedDocument.documentId;

      // console.log(selectedDocument);
      await updateMDXDocumentContent(DatabaseId, contentString);
    } else {
      console.error('No document selected');
    }
  };

  return (
    <Card className="flex flex-col h-auto w-full ">
      <CardHeader>
        <CardTitle>Current Document</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <BlockNoteView editor={editor} />
        </p>
      </CardContent>
      <CardFooter>
        <p>
          <Button variant="outline" className="mb-4" onClick={saveDocument}>
            Save Document
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default MarkdownEditor;
