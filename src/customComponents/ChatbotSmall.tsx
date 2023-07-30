import React, { useState } from 'react';
import ClickableWidget from './ClickableWidget';
import MessagesWindow from './MessagesWindow';

function Chatbot() {
  const [visible, setVisible] = useState(false);
  const toggleChatbot = () => {
    setVisible(!visible);
  };

  return (
    <div className='fixed bottom-10 right-2'>
      {visible && <MessagesWindow />}
      <ClickableWidget toggleChatbot={toggleChatbot} />
    </div>
  );
}

export default Chatbot;
