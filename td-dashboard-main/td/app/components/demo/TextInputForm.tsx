import { useState } from 'react';
import { supabase } from './supabase-client';
import { Configuration, OpenAIApi } from 'openai';

export default function VectorDBInputForm() {
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const configuration = new Configuration({
      apiKey: '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',
    });
    const openAi = new OpenAIApi(configuration);

    // Split the input into chunks of approximately 150 words
    const words = text.split(' ');
    for (let i = 0; i < words.length; i += 150) {
      const chunk = words.slice(i, i + 150).join(' ');

      const embeddingResponse = await openAi.createEmbedding({
        model: 'text-embedding-ada-002',
        input: chunk,
      });

      const [{ embedding }] = embeddingResponse.data.data;

      await supabase.from('documents').insert({
        content: chunk,
        embedding,
      });
    }

    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <label htmlFor="textInput" className="text-lg mb-2">
        Enter your text:
      </label>
      <textarea
        id="textInput"
        value={text}
        onChange={(e) => setText(e.target.value)}
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
  );
}
