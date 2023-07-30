type WidgetProps = {
  toggleChatbot: () => void;
};

const ClickableWidget = ({ toggleChatbot }: WidgetProps) => {
  return (
    <div className='fixed bottom-2 right-2 bg-blue-400' onClick={toggleChatbot}>
      Click me
    </div>
  );
};

export default ClickableWidget;
