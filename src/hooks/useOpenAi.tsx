import React from 'react';
import { useQuery } from 'react-query';

export type OpenAiChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

const fetchData = (
    messages: OpenAiChatMessage[],
    setMessages: React.Dispatch<React.SetStateAction<OpenAiChatMessage[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => async () => {
    const res = await fetch(
        'https://ai-assistance-server.deno.dev/api/v1/ai-assistance',
        { 
            method: 'POST', 
            body: JSON.stringify({ messages }),
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    const { message } = await res.json() ?? {};
    setLoading(false);
    setMessages((prev) => ([
        ...prev,
        {
            role: 'assistant',
            content: message,
        },
    ]));
};

export const useOpenAi = (
    messages: OpenAiChatMessage[],
    setMessages: React.Dispatch<React.SetStateAction<OpenAiChatMessage[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>, 
    enabled: boolean,
) => (
    useQuery<void>({ queryKey: 'openAiResp', queryFn: fetchData(messages, setMessages, setLoading), enabled })
);
