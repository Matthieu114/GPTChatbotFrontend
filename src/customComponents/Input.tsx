import { Input } from '../shadcn/ui/input';

type InputProps = {
  sendPrompt: () => void;
  setMessageData: (value: any) => void;
};

function InputComponent({ sendPrompt, setMessageData }: InputProps) {
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      sendPrompt();
    } else {
      setMessageData(event.target.value);
    }
  };

  return <Input type='text' placeholder='ask me anything' onKeyDown={handleKeyDown} />;
}

export default InputComponent;
