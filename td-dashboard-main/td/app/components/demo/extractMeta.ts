import he from 'he';
import axios from 'axios';
import cheerio from 'cheerio';

const extractMeta = async (url: string) => {
  const META: Record<string, string> = {
    url: url, // Include the URL in the extracted metadata
  };

  let html;
  if (url.startsWith('http')) {
    try {
      const response = await axios.get(url);
      html = response.data;
    } catch (error) {
      console.error('Error fetching the URL', error);
      throw error;
    }
  } else {
    html = url;
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

  // Extract the title if it hasn't been populated by meta tags.
  if (!META.title) {
    META.title = $('title').text();
  }

  return META;
};

export default extractMeta;
