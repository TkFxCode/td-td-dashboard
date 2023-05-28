'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useUser } from '@/app/appwrite/useUser';
import LoadingScreen from '@/app/components/loading/LoadingScreen'; 

export function SigninCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const router = useRouter();
  const { login } = useUser();
  const [loading, setLoading] = useState(false); 

  const handleSignin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowErrorAlert(false);

    setLoading(true); 

    login(email, password)
      .then(() => {
        router.push('/dashboard');
      })
      .catch((error) => {
        setLoading(false); 
        console.log(error);
        setShowErrorAlert(true);
      });
  };

  
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="">Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignin}>
          {showErrorAlert && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Login failed. Please check your email and password and try
                again.
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="text-popover-foreground">
                Email
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="password" className="text-gray-600">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-4 w-full">
            Sign in
          </Button>
          <CardContent className="text-center mt-4 mb-0">
            <span className="text-gray-400">──────────</span>
            <span className="mx-2 text-sm text-gray-600">Or</span>
            <span className="text-gray-400">──────────</span>
          </CardContent>
          <Button className=" w-full">
            <Mail className="mr-2 w-4" /> Login with Email
          </Button>
        </form>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter className="mt-4">
        <p className="text-sm text-center text-gray-500">
          Dont have an account?{' '}
          <a href="/signup" className="text-indigo-600 hover:text-indigo-700">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
