import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/appwrite/useUser';
import LoadingScreen from '@/app/components/loading/LoadingScreen';

export default function withAuth<T extends React.ComponentType<any>>(
  Component: T
) {
  const AuthenticatedComponent: React.FC<React.ComponentProps<T>> = (props) => {
    const router = useRouter();
    const { user, loading } = useUser();

    if (loading) {
      return <LoadingScreen />;
    }

    if (!user) {
      router.push('/login');
      return null;
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
}
