import SearchInput from './SearchInput.jsx'
import Conversations from './Conversations.jsx'
import LogoutButton from './LogoutButton.jsx'

const Sidebar = () => {
  return (
    <div className='border-r bg-base-100 p-4 flex flex-col'>
        <SearchInput />
        <div className='divider px-3'></div>
        <Conversations/>
        <LogoutButton/>
    </div>
  )
}
export default Sidebar