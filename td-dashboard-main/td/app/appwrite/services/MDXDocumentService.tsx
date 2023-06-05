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
    const response = await databases.createDocument(
      '6456b05eb0764a873d05',
      '645c420225d6302464fe',
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
    const response = await databases.listDocuments(
      '6456b05eb0764a873d05',
      '645c420225d6302464fe'
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
    const response = await databases.getDocument(
      '6456b05eb0764a873d05',
      '645c420225d6302464fe',
      documentId
    );

    console.log(response);
    return response;
  } catch (error) {
    console.error('Task update failed:', error);
  }
};

// This function will update the document content in your database
export const updateMDXDocumentContent = async (
  documentId: string,
  content: string
) => {
  try {
    const response = await databases.updateDocument(
      '6456b05eb0764a873d05',
      '645c420225d6302464fe',
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
