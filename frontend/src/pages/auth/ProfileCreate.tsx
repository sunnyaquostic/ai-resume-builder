import { FormEvent, useEffect, useState, type ChangeEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import type { RootState, AppDispatch } from '../../app/store';
import { removeErrors, removeSuccess } from '@/features/serviceSlice';
import { ProfileSetUp } from '../../features/userSlice';
import Loader from '@/components/Loader';

function Register() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, success, error } = useSelector((state: RootState) => state.user)
  const [userProfile, setUserProfile] = useState({
      name: '',
      email: '',
      bio: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
  })
  
  const {
    name, 
    email, 
    bio,
    phone,
    address,
    linkedin,
    github
  } = userProfile

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserProfile({
      ...userProfile,
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
        toast.success('Profile Updated Successful', {position:'top-center', autoClose:3000})
        dispatch(removeSuccess())
        navigate('/dashboard')
    }
  }, [dispatch, success])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    dispatch(ProfileSetUp(userProfile))
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
                Profile SetUp
              </h3>
              <div className="flex items-center justify-between gap-4 w-full mt-5 sm:flex-row flex-col">
                <input
                  type="text"
                  placeholder="Full name"
                  name='name'
                  value={name}
                  onChange={handleChange}
                  className="py-3 px-4 border focus:outline-blue-500 border-gray-300  rounded-lg w-full"
                />
              </div>

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
                  type="phone"
                  placeholder="Enter phone number"
                  name='password'
                  value={phone}
                  onChange={handleChange}
                  className="py-3 px-4 border focus:outline-blue-500 border-gray-300  rounded-lg w-full"
                />
              </div>

              <div className="flex items-center justify-between gap-4 w-full sm:flex-row flex-col">
                <input
                  type="text"
                  placeholder="Enter your address"
                  name='address'
                  value={address}
                  onChange={handleChange}
                  className="py-3 px-4 border focus:outline-blue-500 border-gray-300  rounded-lg w-full"
                />
              </div>

              <div className="flex items-center justify-between gap-4 w-full sm:flex-row flex-col">
                <input
                  type="text"
                  placeholder="YOur linkedin profile url"
                  name='linkedin'
                  value={linkedin}
                  onChange={handleChange}
                  className="py-3 px-4 border focus:outline-blue-500 border-gray-300  rounded-lg w-full"
                />
              </div>

              <div className="flex items-center justify-between gap-4 w-full sm:flex-row flex-col">
                <input
                  type="text"
                  placeholder="Your github profile url"
                  name='github'
                  value={github}
                  onChange={handleChange}
                  className="py-3 px-4 border focus:outline-blue-500 border-gray-300  rounded-lg w-full"
                />
              </div>
              
              <div className="flex items-center justify-between gap-4 w-full sm:flex-row flex-col">
                <input
                  type="text"
                  placeholder="Bio"
                  name='bio'
                  value={bio}
                  onChange={handleChange}
                  className="py-3 px-4 border focus:outline-blue-500 border-gray-300  rounded-lg w-full"
                />
              </div>

              <div className="w-full flex items-center justify-center">
                <button
                  type="submit"
                  className="w-full sm:w-[50%] py-3 px-4 bg-blue-500 text-white border-none outline-none rounded-lg mt-3">
                  {loading ? 'Updating' : 'Update Profile'}
                </button>
              </div>
            </form>
          </main>
      }
    </>
  );
}

export default Register