import { useState } from 'react';
import { Link } from "react-router-dom";
import useLogin from '../../hooks/useLogin';

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {loading,login } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
    }

    return <div className='flex felx-col items-center justify-center min-w-96 mx-auto'>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-3xl text-center font-semibold leading-tight tracking-tight text-gray-900 dark:text-white">
                  Login <span className="text-indigo-700">ChatApp</span>
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                      <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ngoktrunne" required=""
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      />
                  </div>

                  <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      />
                  </div>
                  <p className='text-sm font-light leading-tight'>
                      Don't have account? <Link to="/signup" className="text-primary-600 text-indigo-400 hover:underline hover:text-indigo-700 dark:text-primary-500">Sign up</Link>
                  </p>
                  <button type="submit" className="w-full text-white bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 hover:from-indigo-500 hover:from-10% hover:via-sky-500 hover:via-30% hover:to-emerald-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" disabled={loading}>
                    {loading ? <span className='loading loading-spinner ' ></span> : "Login"}
                  </button>
              </form>
          </div>
      </div>
    </div>
  }
  
  export default Login