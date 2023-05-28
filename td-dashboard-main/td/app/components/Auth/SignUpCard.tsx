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
import LoadingScreen from '@/app/components/loading/LoadingScreen'; 
import { CountryCombobox } from './test';

export function SignupCard() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const router = useRouter();
  const { signup } = useUser(); 
  const avatarUrl = 'https://i.ibb.co/rxFMRry/profile-1.png';
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [cityState, setCityState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const isFormValid = () => {
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.trim() !== '' &&
      username.trim() !== '' &&
      password.trim() !== '' &&
      phoneNumber.trim() !== '' &&
      country.trim() !== '' &&
      cityState.trim() !== '' &&
      postalCode.trim() !== ''
    );
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid()) {
      return;
    }

    setLoading(true); 

    try {
      await signup(
        email,
        password,
        firstName,
        lastName,
        username,
        avatarUrl,
        phoneNumber,
        bio,
        country,
        cityState,
        postalCode
      );
      router.push('/dashboard');
    } catch (error: any) {
      setLoading(false);
      console.error('Signup failed:', error.message);
    }
  };

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
          <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
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
            <Input
              id="phoneNumber"
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
            <Input
              id="bio"
              type="text"
              placeholder="Bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            />
          </div>
          <h2 className="text-lg font-semibold mt-4 mb-2">Address</h2>
          <div className="space-y-4">
            <CountryCombobox setCountry={setCountry} />
            <Input
              id="cityState"
              type="text"
              placeholder="City/State"
              value={cityState}
              onChange={(event) => setCityState(event.target.value)}
            />
            <Input
              id="postalCode"
              type="text"
              placeholder="Postal Code"
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
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
