This is a [Next.js](https://nextjs.org/) project bootstrapped with [`appwrite`](https://appwrite.io/).

## Getting Started

Before you are able to run the development server, you will need to update the .env.local
If you do not have a .env.local file in the main app directory then go ahead and create one.
Populate it with the following informaiton

```bash
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_USER_MDXDOCS_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_USER_TRADING_ACCOUNT_DATA_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_USER_NEWS_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_USER_BOOKMARKS_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_NEWS_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_PUBLIC_NEWS_DOCUMENT_ID=
```

You will also need to create a Web App in Appwrite aswell as a database, and the correct collections.
Foolow the steps below to setup your Appwrite Cloud Database correctly.
Navigate into the main app directory. Then run the install dependencies and run the development server:

```bash
npm i

npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
