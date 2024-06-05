import React from 'react'
import Messages from './Messages'
import MessageInput from './MessageInput'
import { TiMessages } from 'react-icons/ti'
import useConversation from '../../zustand/useConversation'
import {useEffect} from 'react';
import { useAuthContext } from '../../context/AuthContext'

const MessageContainer = () => {
  const {selectedConversation, setSelectedConversation} = useConversation();

  useEffect(() => {

    //cleanup function (unmounts)
    return() => setSelectedConversation(null)
  },[setSelectedConversation]);
  
  return (
    <div  className='md:min-w-[450px] flex flex-col'>
      {! selectedConversation ? ( 
      <NoChatSelected /> 
      ) : (
        <>
        {/* Header */}
      <div className='flex items-center gap-x-2 px-4 py-2 mb-2 h-10'>
        <span className='text-white font-normal pt-2'>To:</span>
        <span className='text-white font-bold pt-2'> {selectedConversation.fullName}</span>
      </div>

      <div className='divider my-0 py-0 h-0'/>

      <Messages/>
      <MessageInput/>
      </>
      )}
    </div>
  )
}

export default MessageContainer

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div className='px-4 text-center sm:text-lg md:text-lg text-black font-semibold flex flex-col items-center gap-2'>
        <p>Welcome {authUser.fullname} </p>
        <p>Select a chat to start messaging</p>
        <TiMessages className='text-3x1 md:text-6xl text-center' />
      </div>
    </div>
  )
}