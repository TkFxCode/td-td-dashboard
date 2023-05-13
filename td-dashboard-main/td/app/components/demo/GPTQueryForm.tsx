import { useState } from 'react';
import { supabase } from './supabase-client';
import { Configuration, OpenAIApi } from 'openai';
import GPT3Tokenizer from 'gpt3-tokenizer';
import { Card, CardContent, CardTitle } from '../ui/card';

export default function GPTQueryForm() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const configuration = new Configuration({
      apiKey: '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',
    });
    const openAi = new OpenAIApi(configuration);
    const input = query.replace(/\n/g, ' ');

    const embeddingResponse = await openAi.createEmbedding({
      model: 'text-embedding-ada-002',
      input,
    });

    const [{ embedding }] = embeddingResponse.data.data;

    const { data: documents } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.78,
      match_count: 10,
    });

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
    let tokenCount = 0;
    let contextText = '';

    // Concat matched documents
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      const content = document.content;
      const encoded = tokenizer.encode(content);
      tokenCount += encoded.text.length;

      // Limit context to max 1500 tokens (configurable)
      if (tokenCount > 4000) {
        break;
      }

      contextText += `${content.trim()}\n---\n`;
    }

    const prompt = `You are a very enthusiastic personal assistant who loves to help people! Given the following sections from the database, answer the question using only that information, outputted in normal text format. If you are unsure and the answer is not explicitly written in the database, say "Sorry, I don't know how to help with that." Context sections: ${contextText} Question: "${query}" Answer as normal text:`;

    const completionResponse = await openAi.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 512,
      temperature: 0,
    });

    const {
      choices: [{ text }],
    } = completionResponse.data;

    setResponse(text ?? '');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label htmlFor="queryInput" className="text-lg mb-2">
          Enter your query:
        </label>
        <textarea
          id="queryInput"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded-lg p-2 mb-4 resize-none"
          rows={10}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
      <div>
        <Card className="m-5">
          <CardTitle>
            <h3 className=" text-2xl font-semibold tracking-tight text-center m-5">
              Response
            </h3>
          </CardTitle>
          <CardContent>
            <blockquote className="mt-6 border-l-2 pl-6 italic">
              {response}
            </blockquote>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
