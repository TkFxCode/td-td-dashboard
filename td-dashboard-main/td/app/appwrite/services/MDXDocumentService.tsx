import { databases } from '@/app/appwrite/appwrite';

export const createNewMDXDocument = async (
  userId: string,
  title: string,
  content: string
) => {
  const documentData = {
    userId: userId,
    title: title,
    content: content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID) {
      throw new Error(
        'NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID is not defined'
      );
    }
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID,
      'unique()',
      documentData
    );
    console.log('New document created:', response);
    return response.$id;
  } catch (error) {
    console.error('Document creation failed:', error);
  }
};

export const getAllMDXDocuments = async (userId: string) => {
  try {
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID) {
      throw new Error(
        'NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID is not defined'
      );
    }
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID
    );

    const documents = response.documents.map((doc) => ({
      userId: doc.userId,
      documentId: doc.$id,
      title: doc.title,
      content: doc.content,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    }));

    console.log(documents);
    return documents;
  } catch (error) {
    console.error('Failed to fetch all documents:', error);
    return [];
  }
};

export const fetchSingleMDXDocument = async (documentId: string) => {
  try {
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID) {
      throw new Error(
        'NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID is not defined'
      );
    }
    const response = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID,
      documentId
    );

    console.log(response);
    return response;
  } catch (error) {
    console.error('Task update failed:', error);
  }
};

export const updateMDXDocumentContent = async (
  documentId: string,
  content: string
) => {
  try {
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID) {
      throw new Error(
        'NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID is not defined'
      );
    }
    const response = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID,
      documentId,
      {
        content: content,
      }
    );
    console.log('Document updated:', response);
  } catch (error) {
    console.log(documentId);
    console.error('Document update failed:', error);
  }
};
export const deleteMDXDocument = async (documentId: string) => {
  try {
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID) {
      throw new Error(
        'NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID is not defined'
      );
    }
    const response = await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID,
      documentId
    );
    console.log('Document deleted:', response);
  } catch (error) {
    console.error('Document deletion failed:', error);
  }
};
