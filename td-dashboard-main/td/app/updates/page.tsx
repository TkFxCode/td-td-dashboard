'use client';
import { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { CalendarIcon } from '@heroicons/react/outline';

const updates = [
  {
    title: 'Update 1',
    date: '2023-05-01',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere.',
  },
  {
    title: 'Update 2',
    date: '2023-05-02',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere.',
  },
  {
    title: 'Update 3',
    date: '2023-05-03',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere.',
  },
  {
    title: 'Update 4',
    date: '2023-05-04',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere.',
  },
];

export default function UpdatesPage() {
  return (
    <div className="bg-background py-6 my-20 flex flex-col justify-center items-center sm:py-12">
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto">
        {' '}
        {/* Updated width class */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-card border border-border shadow-lg sm:rounded-3xl sm:p-20">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 m-3">
            Trading Dashboard Updates
          </h2>
          {updates.map((update, index) => (
            <Disclosure key={index}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-foreground bg-muted rounded-lg hover:bg-muted-foreground focus:outline-none focus-visible:ring focus-visible:ring-accent focus-visible:ring-opacity-75 m-2">
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2 text-foreground" />
                      <span>{update.date}</span>
                      <span className="ml-2">{update.title}</span>
                    </div>
                    <ChevronDown
                      className={`${
                        open ? 'transform rotate-180' : ''
                      } w-5 h-5 text-foreground`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-foreground">
                    {update.description}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </div>
  );
}
