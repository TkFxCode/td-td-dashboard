import he from 'he';
import axios from 'axios';
import cheerio from 'cheerio';
import { NextApiRequest, NextApiResponse } from 'next';

interface Params {
  url: string;
}

export async function GET(
  request: NextApiRequest,
  { params }: { params: Params },
  response: NextApiResponse
) {
  const encodedUrl = params.url;
  const completeUrl = decodeURIComponent(encodedUrl);

  const META: Record<string, string> = {
    completeUrl: completeUrl as string,
  };

  let html;
  try {
    const response = await axios.get(completeUrl as string);
    html = response.data;
  } catch (error) {
    console.error('Error fetching the URL', error);
    return new Response(
      JSON.stringify({ status: 'error', message: 'Error fetching the URL' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  const $ = cheerio.load(html);
  const tags: Record<string, string[]> = {
    title: ['title', 'og:title', 'twitter:title', 'og:site_name'],
    description: ['description', 'og:description', 'twitter:description'],
    image: ['image', 'og:image', 'twitter:image'],
    url: ['url', 'og:url', 'twitter:url'],
    keywords: [
      'tags',
      'og:tags',
      'twitter:tags',
      'keywords',
      'og:keywords',
      'twitter:keywords',
    ],
  };

  Object.keys(tags).forEach((tag) => {
    tags[tag].some((prop) => {
      const content =
        $(`meta[property='${prop}']`).attr('content') ||
        $(`meta[name='${prop}']`).attr('content');
      if (content) {
        META[tag] = he.decode(content);
        return true;
      }
    });
  });

  
  if (!META.title) {
    META.title = $('title').text();
  }

  return new Response(JSON.stringify({ status: 'success', data: META }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
