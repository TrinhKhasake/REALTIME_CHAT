import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import useConversation from "../zustand/useConversation";
import useGetConversations from '../hooks/useGetConversation'
import toast from "react-hot-toast";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const {setSelectedConversation } = useConversation()
  const {conversations } = useGetConversations()

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!search) return;
    if(search.length < 3) {
      return toast.error('Search term must be at least 3 characters long')
    }

    const conversation = conversations.find((c) => c.fullName.toLowerCase().includes(search.toLowerCase()))

    if(conversation){
      setSelectedConversation(conversation);
      setSearch("");
    } else toast.error("No such user found!")
  }
  return (
    <form onSubmit={handleSubmit} className="flex items-center max-w-sm mx-auto">   
      <div className="relative w-full">
          <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full ps-4 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search your friends..." required 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          />
      </div>
      <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-violet-500 rounded-full border-violet-500 hover:bg-indigo-800">
          <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
      </button>
    </form>
  )
}

export default SearchInput