import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, OutlinedInput } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { ResearchAbstract } from '../../hooks/useArXiv';
import { useOpenAi, OpenAiChatMessage } from '../../hooks/useOpenAi';
import './AiAssistantContainer.scss';

const getInstructions = (instructions: string, research: ResearchAbstract[]) => (
    JSON.stringify({ 
        instructions, 
        research,
    })
);

type ComponentProps = {
    selectedArticles: ResearchAbstract[];
};

export default function AiAssistantContainer(props: ComponentProps) {
    const { selectedArticles } = props;
    const [userInstructions, setUserInstructions] = useState('');
    const [messages, setMessages] = useState<OpenAiChatMessage[]>([]);
    const [isAiRespEnabled, enableAiResp] = useState(false);
    const [isChatModalOpen, setChatModalOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    useOpenAi(messages, setMessages, setLoading, isAiRespEnabled);

    const handleUserInstructions = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setUserInstructions(e.target.value);
        },
        [],
    );

    const handleSendChatMessages = useCallback(
        (instructions: string, selectedArticles: ResearchAbstract[], eraseInput: boolean = false) => () => {
            setMessages((prev) => ([
                ...prev,
                {
                    role: 'user',
                    content: getInstructions(instructions, selectedArticles),
                },
            ]));
            setLoading(true);
            setChatModalOpen(true);
            enableAiResp(true);
            if (eraseInput) {
                setUserInstructions('');
            }
        },
        [],
    );

    const toggleChatModal = useCallback(() => { setChatModalOpen((prev) => !prev) }, []);

    const getActions = useCallback(
        (selectedArticles: ResearchAbstract[]) => ([
            { name: 'Summarize', handler: handleSendChatMessages('summarize the following research', selectedArticles) },
            { name: 'Find Trends', handler: handleSendChatMessages('find the common trends in the following research', selectedArticles) },
            { name: 'Find Themes', handler: handleSendChatMessages('find the common themes in the following research', selectedArticles) },
        ]),
        [],
    );

    useEffect(
        () => { 
            if (isAiRespEnabled) {
                enableAiResp(false); 
            }
        }, 
        [isAiRespEnabled],
    );

    useEffect(
        () => {
            const messagesContainerElem = messagesContainerRef.current;
            if (messagesContainerElem) {
                const offset = messagesContainerElem.scrollHeight;
                messagesContainerElem.scrollTop = offset;
            }
        },
        [messages.length],
    )
    
    return (
        <div className={`ai-chat${!isChatModalOpen ? '--hidden' : ''}`}>
            <Button 
                className="ai-chat--close-button"
                onClick={toggleChatModal}
            >
                {isChatModalOpen ? <CloseIcon /> : <SmartToyIcon />}
            </Button>
            {isChatModalOpen ? (
                <>
                    <div className="ai-chat--messages">
                        <div className="ai-chat--messages-background" ref={messagesContainerRef}>
                            {messages.map((message, index) => (
                                <p className={`ai-chat--${message.role}`} key={index}>
                                    {message.role === 'assistant' ? message.content : (
                                        <>
                                            <span>{JSON.parse(message.content).instructions}</span>
                                            {JSON.parse(message.content).research.map((abstract: ResearchAbstract) => (
                                                <span 
                                                    key={abstract.title}
                                                    className="ai-chat--user-selections" 
                                                >
                                                    &bull; {abstract.title}
                                                </span>
                                            ))}
                                        </>
                                    )}
                                </p>
                            ))}
                            {isLoading ? (
                                <p className="ai-chat--assistant-working">I'm working on it ...</p>
                            ) : null}
                        </div>
                    </div>
                    <div className="ai-chat--actions">
                        {getActions(selectedArticles).map((action) => (
                            <Button 
                                key={action.name}
                                className="ai-chat--action-button" 
                                onClick={action.handler}
                            >
                                {action.name}
                            </Button>
                        ))}
                    </div>
                    <form className="ai-chat--inputs-control" onSubmit={(e) => { e.preventDefault(); }}>
                        <OutlinedInput
                            className="ai-chat--text-input"
                            type="text"
                            placeholder="Ask AI assistant"
                            value={userInstructions}
                            onChange={handleUserInstructions}
                        />
                        <Button
                            type="submit"
                            className="ai-chat--send-button"
                            onClick={handleSendChatMessages(userInstructions, selectedArticles, true)}
                            disabled={isLoading}
                        >
                            Send
                        </Button>
                    </form>
                </>
            ) : null}
        </div>
    );
}
