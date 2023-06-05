// types.ts

export type Event = {
  title: string;
  country: string;
  date: string;
  time: string;
  impact: string;
  forecast: string;
  previous: string;
};

export type ApiData = Array<Event>;
