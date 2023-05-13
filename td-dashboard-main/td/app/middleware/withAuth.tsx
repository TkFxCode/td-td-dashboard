import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/appwrite/useUser';
import LoadingScreen from '@/app/components/loading/LoadingScreen';

// Add the generic type T
export default function withAuth<T extends React.ComponentType<any>>(
  Component: T
) {
  // Specify the type for the returned AuthenticatedComponent
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
