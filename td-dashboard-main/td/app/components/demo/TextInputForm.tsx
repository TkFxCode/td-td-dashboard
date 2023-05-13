import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { supabase } from './supabase-client';
import { Configuration, OpenAIApi } from 'openai';
import { Loader2 } from 'lucide-react';
import { Label } from '@/app/components/ui/label';

export default function VectorDBInputForm() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

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
    setIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <Label
          htmlFor="uploadInput"
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
        >
          Enter your data:
        </Label>
        <Textarea
          id="uploadInput"
          placeholder="Enter your content to add to the database here."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {isLoading ? ( // Conditionally render the loading button
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button>Upload Data</Button>
        )}
      </form>
    </div>
  );
}
