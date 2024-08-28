import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage("");
	};
  
  return (
    <form className='px-4 my-0 backdrop-blur opacity-100 ' onSubmit={handleSubmit}>
        <div className='w-full py-2 relative flex items-center'>
            <input type="text" 
            className='border text-sm rounded-lg block w-full p-2.5  text-black'
            placeholder='Send a message'
            value={message}
					onChange={(e) => setMessage(e.target.value)}
            />
            <button type='submit' 
            className='absolute inset-y-0 end-0 flex items-center pe-3 text-violet-700'>
            {loading ? <div className='loading loading-spinner'></div> : <BsSend />}   
            </button>
        </div>
    </form>
  );
};
export default MessageInput