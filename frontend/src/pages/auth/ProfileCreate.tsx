import { FormEvent, useEffect, useState, type ChangeEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin, Linkedin, Github, FileText, ArrowLeft } from 'lucide-react';
import type { RootState, AppDispatch } from '../../app/store';
import { removeErrors, removeSuccess } from '@/features/serviceSlice';
import { ProfileSetUp, GetProfile } from '../../features/userSlice';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';

function ProfileCreate() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, success, error, userInfo } = useSelector((state: RootState) => state.user)
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

  // Load existing profile data if available
  useEffect(() => {
    if (userInfo) {
      setUserProfile({
        name: userInfo.name || '',
        email: userInfo.email || '',
        bio: userInfo.bio || '',
        phone: userInfo.phone || '',
        address: userInfo.address || '',
        linkedin: userInfo.linkedin || '',
        github: userInfo.github || '',
      })
    }
  }, [userInfo])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        toast.success('Profile Updated Successfully', {position:'top-center', autoClose:3000})
        dispatch(removeSuccess())
        navigate('/dashboard')
    }
  }, [dispatch, success])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Basic validation
    if (!name.trim()) {
      toast.error('Name is required', {position:'top-center', autoClose:3000})
      return
    }

    if (!email.trim()) {
      toast.error('Email is required', {position:'top-center', autoClose:3000})
      return
    }

    dispatch(ProfileSetUp(userProfile))
  }

  return (
    <>
      {loading 
        ? <Loader />
        : 
            <main className="w-full min-h-[100vh] h-auto bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center sm:py-12 p-6">
            <div className="w-full max-w-4xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">AR</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
                <p className="text-gray-600">Help us personalize your resume building experience</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Preview */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Profile Preview
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{name || 'Your Name'}</p>
                          <p className="text-sm text-gray-500">{email || 'your.email@example.com'}</p>
                        </div>
                      </div>
                      
                      {phone && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{phone}</span>
                        </div>
                      )}
                      
                      {address && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{address}</span>
                        </div>
                      )}
                      
                      {linkedin && (
                        <div className="flex items-center gap-3 text-sm text-blue-600">
                          <Linkedin className="h-4 w-4" />
                          <span>LinkedIn Profile</span>
                        </div>
                      )}
                      
                      {github && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Github className="h-4 w-4" />
                          <span>GitHub Profile</span>
                        </div>
                      )}
                      
                      {bio && (
                        <div className="pt-2">
                          <p className="text-sm text-gray-600">{bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-2">
                  <form 
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-lg p-8 space-y-6"
                  >
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            placeholder="Enter your full name"
                            name='name'
                            value={name}
                            onChange={handleChange}
                            required
                            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            name='email'
                            value={email}
                            onChange={handleChange}
                            required
                            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            placeholder="Enter your phone number"
                            name='phone'
                            value={phone}
                            onChange={handleChange}
                            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>

                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            placeholder="Enter your address"
                            name='address'
                            value={address}
                            onChange={handleChange}
                            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional Links */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                            LinkedIn Profile
                          </label>
                          <input
                            type="url"
                            id="linkedin"
                            placeholder="https://linkedin.com/in/yourprofile"
                            name='linkedin'
                            value={linkedin}
                            onChange={handleChange}
                            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>

                        <div>
                          <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">
                            GitHub Profile
                          </label>
                          <input
                            type="url"
                            id="github"
                            placeholder="https://github.com/yourusername"
                            name='github'
                            value={github}
                            onChange={handleChange}
                            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Bio */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">About You</h3>
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                          Professional Bio
                        </label>
                        <textarea
                          id="bio"
                          placeholder="Tell us about yourself and your professional background..."
                          name='bio'
                          value={bio}
                          onChange={handleChange}
                          rows={4}
                          className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        {loading ? 'Saving Profile...' : 'Save Profile'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
      }
    </>
  );
}

export default ProfileCreate