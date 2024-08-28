import React from 'react'
import useConversation from '../../zustand/useConversation';
import { extractTime } from '../../../untils/extractTime';
import { useAuthContext} from '../../context/AuthContext'

const Message = ({message}) => {
  const {authUser} = useAuthContext();
  const {selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? 'from-blue-500 via-indigo-700' : "";

  const ShakeClass = message.shouldShake ? "shake" : ""

  return (
    <div className={`chat ${chatClassName}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img 
            alt='Tailwind CSS chat bubble component'
            src={profilePic}
            />
          </div>
        </div>
        <div className={`chat-bubble text-white bg-gradient-to-r  ${bubbleBgColor} ${ShakeClass} pb-2`}>{message.message}</div>
        <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
    </div>
  )
}

export default Message