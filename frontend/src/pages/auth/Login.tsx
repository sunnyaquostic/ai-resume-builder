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
  const { loading, loginStatus, error } = useSelector((state: RootState) => state.user)
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
    if (loginStatus === "succeeded") {
      toast.success("Login Successful", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      navigate("/");
    }
  }, [loginStatus, dispatch, navigate]);

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
            <main className="w-full min-h-[100vh] h-auto bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center sm:py-12 p-6">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">AR</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your account to continue</p>
              </div>
              
              <form 
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-lg p-8 space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      name='email'
                      value={email}
                      autoComplete='username'
                      onChange={handleChange}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      name='password'
                      value={password}
                      onChange={handleChange}
                      autoComplete='new-password'
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                <div className="text-center">
                  <span className="text-gray-600">
                    Don&apos;t have an account?{" "}
                  </span>
                  <Link
                    to={"/register"}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    Sign up here
                  </Link>
                </div>
              </form>
            </div>
          </main>
      }
    </>
  );
}

export default Login