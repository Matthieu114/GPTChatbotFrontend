import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../shadcn/ui/input';
import { Button } from '../shadcn/ui/button';
import { ButtonLoading } from './ButtonLoading';
import { SkeletonLoader } from './SkeletonLoader';

interface Message {
  id: string | null;
  text: string;
  sender: string;
  timestamp: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessageHistory();
  }, []);

  const loadMessageHistory = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/chat-messages');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    const newMessage: Message = {
      id: null,
      text: input,
      sender: 'You',
      timestamp: 'Now'
    };
    await setMessages([...messages, newMessage]);
    setInput('');
    setLoading(true);
    try {
      await sendPromptToServer(newMessage);
    } catch (error) {
      console.error('Error sending prompt to server:', error);
    }
    setLoading(false); // Set loading to false after API response is received
  };

  const sendPromptToServer = async (newMessage: Message) => {
    const dataToSend = { message: newMessage };
    try {
      const response = await fetch('http://localhost:4000/api/process-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Server returned an error:', response.status);
      }
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
  };

  const renderMessages = () => {
    return messages.map((message: Message) => (
      <div key={message.id} className='mb-4 p-2 rounded-md bg-gray-100 text-gray-800'>
        <div className='text-gray-600 text-sm mb-1'>
          <span className='font-bold'>{message.sender}</span> at {message.timestamp}
        </div>
        {message.text}
      </div>
    ));
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
