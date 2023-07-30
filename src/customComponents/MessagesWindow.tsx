import React, { useState } from 'react';
import InputComponent from './Input';

const MessagesWindow = () => {
  const [data, setData] = useState();
  const [messageResult, setMessageResult] = useState();

  const sendPromptToServer = async () => {
    const dataToSend = { prompt: data };

    try {
      const response = await fetch('http://localhost:4000/api/process-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        const result = await response.json();
        setMessageResult(result.result);
      } else {
        console.error('Server returned an error:', response.status);
      }
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
  };

  const setMessageData = (value: any) => {
    setData(value);
  };

  return (
    <div className='bg-blue-200 h-96 w-96'>
      <div className='flex flex-col justify-between h-full w-full p-3 '>
        <div className='overflow-scroll'>
          <div>{messageResult && JSON.parse(messageResult)[0][1]}</div>
        </div>
        <InputComponent sendPrompt={sendPromptToServer} setMessageData={setMessageData} />
      </div>
    </div>
  );
};

export default MessagesWindow;
