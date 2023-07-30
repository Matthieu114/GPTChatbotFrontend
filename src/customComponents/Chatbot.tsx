import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../shadcn/ui/input';
import { Button } from '../shadcn/ui/button';
import { ButtonLoading } from './ButtonLoading';
import { SkeletonLoader } from './SkeletonLoader';
import useLocalStorage from '../hooks/useLocalStorage';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useLocalStorage('chatMessages', []);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessageHistory();
  });

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessageHistory = () => {
    if (Array.isArray(messages) && messages.length > 0) {
      setMessages(messages);
    }
  };

  const generateUniqueId = () => {
    // Replace this with your preferred unique ID generation logic
    return `message_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    const newMessage: Message = {
      id: generateUniqueId(),
      text: input,
      sender: 'You', // Assume the sender is the user (can be modified as needed)
      timestamp: new Date().toLocaleString() // Get the current timestamp (can be modified as needed)
    };
    await setMessages([...messages, newMessage]);
    setLoading(true);
    try {
      await sendPromptToServer(newMessage);
    } catch (error) {
      console.error('Error sending prompt to server:', error);
    }
    setLoading(false); // Set loading to false after API response is received
    setInput('');
  };

  const sendPromptToServer = async (newMessage: Message) => {
    const dataToSend = { prompt: newMessage.text };
    try {
      const response = await fetch('http://localhost:4000/api/process-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        const { result } = await response.json();

        const gptResponse: Message = {
          id: generateUniqueId(),
          text: result,
          sender: 'Chatgpt', // Assume the sender is the user (can be modified as needed)
          timestamp: new Date().toLocaleString() // Get the current timestamp (can be modified as needed)
        };
        setMessages((prevMessages: Array<Message>) => [...prevMessages, gptResponse]);
      } else {
        console.error('Server returned an error:', response.status);
      }
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
  };

  const renderMessages = () => {
    return messages.map((message: Message, index: number) =>
      loading && messages.length === index + 1 ? (
        <SkeletonLoader />
      ) : (
        <div key={message.id} className='mb-4 p-2 rounded-md bg-gray-100 text-gray-800'>
          <div className='text-gray-600 text-sm mb-1'>
            <span className='font-bold'>{message.sender}</span> at {message.timestamp}
          </div>
          {message.text}
        </div>
      )
    );
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='w-3/5 max-h-[750px] overflow-y-auto rounded-md' ref={messageContainerRef}>
        {renderMessages()}
      </div>

      <form onSubmit={handleSubmit} className='mt-4 w-3/5'>
        <Input type='text' value={input} onChange={handleInput} className='w-full p-2 rounded-md border border-gray-300' disabled={loading} />
        {loading ? (
          <ButtonLoading />
        ) : (
          <Button type='submit' variant='outline' className='mt-2'>
            send message
          </Button>
        )}
      </form>
    </div>
  );
};

export default Chatbot;
