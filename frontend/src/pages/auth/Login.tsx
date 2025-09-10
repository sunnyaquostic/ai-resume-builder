import { FormEvent, useEffect, useState, type ChangeEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import type { RootState, AppDispatch } from '../../app/store';
import { removeErrors, removeSuccess } from '@/features/serviceSlice';
import { LoginUser } from '../../features/userSlice';
import Loader from '@/components/Loader';


function Login() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, success, error } = useSelector((state: RootState) => state.user)
  const [userData, setUserData] = useState({
      email: '',
      password: ''
  })
  
  const {
     email, 
     password
  } = userData

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    if (error) {
        const message = typeof error === "string" ? error : JSON.stringify(error)
        toast.error(message, {position:'top-center', autoClose:3000})
        dispatch(removeErrors())
    }
  },[dispatch, error])

  useEffect(() => {
    if (success) {
        toast.success('Registration Successful', {position:'top-center', autoClose:3000})
        dispatch(removeSuccess())
        navigate('/login')
    }
  }, [dispatch, success])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(!userData.email || !userData.password) {
      toast.error('All fields are required!', {position:'top-center', autoClose: 3000})
      return 
    }

    dispatch(LoginUser(userData))
  }

  return (
    <>
      {loading 
        ? <Loader />
        : 
            <main className="w-full min-h-[100vh] h-auto bg-blue-500 flex items-center justify-center sm:py-12 p-6">
            <form 
              onSubmit={handleSubmit}
              className="w-full sm:w-[900px] sm:max-w-[1000px]: bg-white rounded-lg sm:py-6 sm:px-8 p-4 flex flex-col gap-5"
            >
              <h3 className="text-[1.8rem] font-[700] text-gray-900 text-center">
                Sign Up
              </h3>

              <div className="flex items-center justify-between gap-4 w-full sm:flex-row flex-col">
                <input
                  type="email"
                  placeholder="Email"
                  name='email'
                  value={email}
                  onChange={handleChange}
                  className="py-3 px-4 border focus:outline-blue-500 border-gray-300  rounded-lg w-full"
                />
              </div>

              <div className="flex items-center justify-between gap-4 w-full sm:flex-row flex-col">
                <input
                  type="password"
                  placeholder="Password"
                  name='email'
                  value={password}
                  onChange={handleChange}
                  className="py-3 px-4 border focus:outline-blue-500 border-gray-300  rounded-lg w-full"
                />
              </div>

              <div className="w-full flex items-center justify-center">
                <button
                  type="submit"
                  className="w-full sm:w-[50%] py-3 px-4 bg-blue-500 text-white border-none outline-none rounded-lg mt-3"
                >
                  {loading ? "Processing..." : "Login"}
                </button>
              </div>

              <div className="flex items-center justify-center w-full gap-1">
                <span className="text-[1rem] text-gray-600 font-[500]">
                  Don&apos;t have an account?{" "}
                </span>
                <span>
                  <Link
                    to={"/register"}
                    className="text-[1rem] text-blue-500 font-[500]">
                    Register
                  </Link>
                </span>
              </div>

              <div className="w-full my-1 flex items-center justify-center gap-3">
                <hr className="w-[45%] bg-gray-400 h-[2px]" />
                <p>or</p>
                <hr className="w-[45%] bg-gray-400 h-[2px]" />
              </div>
            </form>
          </main>
      }
    </>
  );
}

export default Login