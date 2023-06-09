import { BlockNoteEditor } from '@blocknote/core';
import {
  BlockNoteView,
  ToggledStyleButton,
  Toolbar,
  BlockTypeDropdown,
  TextAlignButton,
  ColorStyleButton,
  NestBlockButton,
  UnnestBlockButton,
  CreateLinkButton,
  ReactSlashMenuItem,
  defaultReactSlashMenuItems,
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
  clearSelectedDocument: () => void;
  updateDocumentList: () => void;
};

const CustomFormattingToolbar: React.FC<ToolbarProps> = ({ editor }) => {
  return (
    <Toolbar>
      <BlockTypeDropdown editor={editor} />
      <ToggledStyleButton editor={editor} toggledStyle="bold" />
      <ToggledStyleButton editor={editor} toggledStyle="italic" />
      <ToggledStyleButton editor={editor} toggledStyle="underline" />
      <ToggledStyleButton editor={editor} toggledStyle="strike" />
      <ToggledStyleButton editor={editor} toggledStyle="code" />
      <TextAlignButton editor={editor} textAlignment="left" />
      <TextAlignButton editor={editor} textAlignment="center" />
      <TextAlignButton editor={editor} textAlignment="right" />
      <ColorStyleButton editor={editor} />
      <NestBlockButton editor={editor} />
      <UnnestBlockButton editor={editor} />
      <CreateLinkButton editor={editor} />
    </Toolbar>
  );
};

const MarkdownEditor: React.FC<Props> = ({
  initialContents,
  selectedDocument,
  clearSelectedDocument,
  updateDocumentList,
}) => {
  const newSlashMenuItems: ReactSlashMenuItem[] = defaultReactSlashMenuItems;
  const editor: BlockNoteEditor | null = useBlockNote({
    initialContent: initialContents ? JSON.parse(initialContents) : undefined,
    slashMenuItems: newSlashMenuItems,
    customElements: {
      formattingToolbar: CustomFormattingToolbar,
    },
    onEditorContentChange: (editor: BlockNoteEditor) => {
      localStorage.setItem(
        'editorContent',
        JSON.stringify(editor.topLevelBlocks)
      );
    },
  } as any);

  if (!editor) return null;

  const saveDocument = async () => {
    if (selectedDocument) {
      const contentString = JSON.stringify(editor.topLevelBlocks);
      const DatabaseId = selectedDocument.documentId;

      await updateMDXDocumentContent(DatabaseId, contentString);
      updateDocumentList();
      clearSelectedDocument();
    } else {
      console.error('No document selected');
    }
  };

  return (
    <Card className="flex flex-col h-auto w-full ">
      <CardHeader>
        <CardTitle>Current Document</CardTitle>
        <CardDescription></CardDescription>
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
