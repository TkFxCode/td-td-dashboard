import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  getUserDocument,
  updateUserDocument,
  useUser,
} from '@/app/appwrite/useUser';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
interface UserDocument {
  username?: string;
  email?: string;
  $id?: string;
  tasks?: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  country?: string;
  cityState?: string;
  postalCode?: string;
}

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .optional(),
  email: z.string().email().optional(),
  userId: z.string().optional(),
  tasks: z.array(z.string()).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
  cityState: z.string().optional(),
  postalCode: z.string().optional(),
});

export function ProfileForm() {
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
  const { user, getUserDocument } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: userDoc?.username,
      email: userDoc?.email,
      userId: userDoc?.$id,
      tasks: userDoc?.tasks,
      firstName: userDoc?.firstName,
      lastName: userDoc?.lastName,
      phoneNumber: userDoc?.phoneNumber,
      bio: userDoc?.bio,
      country: userDoc?.country,
      cityState: userDoc?.cityState,
      postalCode: userDoc?.postalCode,
    },
  });

  useEffect(() => {
    if (user?.$id) {
      getUserDocument(user.$id).then((userDocument) => {
        setUserDoc(userDocument);
        form.reset({
          username: userDocument?.username,
          email: userDocument?.email,
          userId: userDocument?.$id,
          tasks: userDocument?.tasks,
          firstName: userDocument?.firstName,
          lastName: userDocument?.lastName,
          phoneNumber: userDocument?.phoneNumber,
          bio: userDocument?.bio,
          country: userDocument?.country,
          cityState: userDocument?.cityState,
          postalCode: userDocument?.postalCode,
        });
      });
    }
  }, [user, getUserDocument]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const updatedUserDoc = await updateUserDocument(user.$id, values);

    setUserDoc(updatedUserDoc);

    form.reset({
      username: updatedUserDoc?.username,
      email: updatedUserDoc?.email,
      userId: updatedUserDoc?.$id,
      tasks: updatedUserDoc?.tasks,
      firstName: updatedUserDoc?.firstName,
      lastName: updatedUserDoc?.lastName,
      phoneNumber: updatedUserDoc?.phoneNumber,
      bio: updatedUserDoc?.bio,
      country: updatedUserDoc?.country,
      cityState: updatedUserDoc?.cityState,
      postalCode: updatedUserDoc?.postalCode,
    });

    setIsSubmitting(false);
  }
  if (isSubmitting) {
    return <div>Loading...</div>;
  }
  if (!userDoc) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={userDoc?.username}
                      defaultValue={userDoc?.username}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={userDoc?.email}
                      defaultValue={userDoc?.email}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={userDoc?.firstName}
                      defaultValue={userDoc?.firstName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={userDoc?.lastName}
                      defaultValue={userDoc?.lastName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={userDoc?.phoneNumber}
                      defaultValue={userDoc?.phoneNumber}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={userDoc?.bio}
                      defaultValue={userDoc?.bio}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={userDoc?.country}
                      defaultValue={userDoc?.country}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cityState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/State</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={userDoc?.cityState}
                      defaultValue={userDoc?.cityState}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={userDoc?.postalCode}
                      defaultValue={userDoc?.postalCode}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
