import Sidebar from "../../components/Sidebar.jsx"
import MessageContainer from "../../components/messages/MessageContainer.jsx"

const Home = () => {
  return <div className='flex felx-co items-center justify-center min-w-96 mx-auto'>
    <div className="flex sm:h-[450px] md:h-[550px] overflow-hidden bg-white rounded-2xl shadow-2xl dark:border dark:bg-gray-800 dark:border-gray-700">
      <Sidebar />
      <MessageContainer />
    </div>
  </div>
}

export default Home