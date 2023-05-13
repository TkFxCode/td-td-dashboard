import { useState } from 'react';
import { supabase } from './supabase-client';
import { Configuration, OpenAIApi } from 'openai';
import GPT3Tokenizer from 'gpt3-tokenizer';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Label } from '@/app/components/ui/label';

export default function GPTQueryForm() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

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
    setIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <Label
          htmlFor="queryInput"
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
        >
          Enter your query:
        </Label>

        <Textarea
          id="queryInput"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your message here."
        />

        {isLoading ? ( // Conditionally render the loading button
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button>Submit Query</Button>
        )}
      </form>
      <div>
        <Card className="m-5">
          <CardTitle>
            <h3 className=" text-2xl font-semibold tracking-tight text-center m-5">
              Response
            </h3>
          </CardTitle>
          <CardContent>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              {response}
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
