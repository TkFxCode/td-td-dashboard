'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/appwrite/useUser';
import LoadingScreen from '@/app/components/loading/LoadingScreen'; // Import LoadingScreen component

export function SignupCard() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();
  const { signup } = useUser(); // Get the signup function from useUser hook

  const isFormValid = () => {
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.trim() !== '' &&
      username.trim() !== '' &&
      password.trim() !== ''
    );
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid()) {
      return;
    }

    setLoading(true); // Set loading to true when starting sign up process

    // Combine first and last name into a single name
    const name = `${firstName} ${lastName}`;

    try {
      await signup(email, password, name, username);
      // TODO: Add code to store additional user data (e.g. username) if required
      router.push('/dashboard');
    } catch (error: any) {
      setLoading(false); // Set loading to false when sign up process fails
      console.error('Signup failed:', error.message);
    }
  };

  // Show LoadingScreen component when loading is true
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp}>
          <div className="space-y-4">
            <Input
              id="firstName"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <Input
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button className="mt-4 w-full" type="submit">
            Sign up
          </Button>
        </form>
      </CardContent>
      <CardFooter className="mt-4">
        <p className="text-sm text-center text-gray-500">
          Already have an account?{' '}
          <a
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Sign in
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
