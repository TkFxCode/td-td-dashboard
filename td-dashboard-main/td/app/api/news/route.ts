import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseStringPromise } from 'xml2js';

interface Event {
  title: string;
  country: string;
  date: string;
  time: string;
  impact: string;
  forecast: string;
  previous: string;
}

export async function GET(
  _: NextApiRequest,
  __: { params: {} },
  response: NextApiResponse
) {
  try {
    const xmlResponse = await axios.get<string>(
      'https://nfs.faireconomy.media/ff_calendar_thisweek.xml?version=f06f9eab0a10a2a0ef0654443a5505e8'
    );

    const result = await parseStringPromise(xmlResponse.data);

    const eventsData: Event[] = result.weeklyevents.event.map((event: any) => ({
      title: event.title[0],
      country: event.country[0],
      date: event.date[0],
      time: event.time[0],
      impact: event.impact[0],
      forecast: event.forecast[0],
      previous: event.previous[0],
    }));

    return new Response(
      JSON.stringify({
        status: 'success',
        events: eventsData,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    return new Response(
      JSON.stringify({ status: 'error', message: (error as Error).message }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
