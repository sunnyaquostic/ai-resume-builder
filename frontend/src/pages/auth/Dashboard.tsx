import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, NavLink } from 'react-router-dom'
import { Menu, LogOut, Home, User, FileText, Plus, Download, Eye, Trash2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RootState, AppDispatch } from '../../app/store'
import { getResume, DeleteResume, resumePdf, resumeWord } from '../../features/serviceSlice'
import { LogoutUser, getProfile } from '../../features/userSlice'
import Loader from '../../components/Loader'
import { ResumeInfo } from "@/types/serviceTypes"

function Dashboard() {
  const [isOpen, setIsOpen] = useState(true)
  const [showProfile, setShowProfile] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  
  const { loading, success, resumeInfo } = useSelector((state: RootState) => state.resume)
  const { userInfo, loading: userLoading } = useSelector((state: RootState) => state.user)
  const [resumes, setResumes] = useState<ResumeInfo[]>([])

  useEffect(() => {
    if (success && resumeInfo.length > 0) {
      setResumes(resumeInfo);
    }
  }, [success, resumeInfo]);

  console.log(resumeInfo);

  const handleDeleteResume = (resumeId: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      dispatch(DeleteResume(resumeId))

      setTimeout(() => {
        dispatch(getResume())
      }, 1000)
    }
  }

const handleDownloadPDF = (resumeId: string) => {
  dispatch(resumePdf(resumeId));
};

const handleDownloadWord = (resumeId: string) => {
  dispatch(resumeWord(resumeId));
};


  const handleLogout = () => {
    dispatch(LogoutUser())
    navigate('/login')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleViewProfile = (e?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (e) e.preventDefault()
    const nextShow = !showProfile
    setShowProfile(nextShow)
    if (nextShow) {
      dispatch(getProfile())
    }
  }

  if (loading) {
    return <Loader />
  }


  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AR</span>
            </div>
            {isOpen && <span className="text-lg font-bold text-gray-900">Dashboard</span>}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="text-gray-600 hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`
            }
          >
            <Home className="w-5 h-5" />
            {isOpen && <span>Overview</span>}
          </NavLink>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <FileText className="w-5 h-5" />
            {isOpen && <span>My Resumes</span>}
          </a>
          <NavLink
            to="/profile/create"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`
            }
          >
            <User className="w-5 h-5" />
            {isOpen && <span>Profile</span>}
          </NavLink>
          <a
            href="#"
            onClick={handleViewProfile}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${showProfile ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
          >
            <User className="w-5 h-5" />
            {isOpen && <span>{showProfile ? 'Hide Profile' : 'View Profile'}</span>}
          </a>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userInfo.name || 'User'}! 
          </h1>
          <p className="text-gray-600">Manage your AI-generated resumes and create new ones.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Resumes</p>
                <p className="text-2xl font-bold text-gray-900">{resumes.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resumes.filter(resume => {
                    const resumeDate = new Date(resume.$createdAt || resume.createdAt)
                    const now = new Date()
                    return resumeDate.getMonth() === now.getMonth() && resumeDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready to Use</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resumes.filter(resume => resume.resume && resume.resume.trim() !== '').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {showProfile && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Profile</h2>
              <Button variant="outline" onClick={handleViewProfile}>{showProfile ? 'Close' : 'View Profile'}</Button>
            </div>
            <div className="p-6">
              {userLoading ? (
                <Loader />
              ) : userInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-900">{userInfo.name}</span></div>
                  <div><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-900">{userInfo.email}</span></div>
                  {userInfo.role && (<div><span className="font-medium text-gray-700">Role:</span> <span className="text-gray-900">{userInfo.role}</span></div>)}
                  {userInfo.phone && (<div><span className="font-medium text-gray-700">Phone:</span> <span className="text-gray-900">{userInfo.phone}</span></div>)}
                  {userInfo.address && (<div><span className="font-medium text-gray-700">Address:</span> <span className="text-gray-900">{userInfo.address}</span></div>)}
                  {userInfo.linkedin && (<div><span className="font-medium text-gray-700">LinkedIn:</span> <a className="text-blue-600 hover:underline" href={userInfo.linkedin} target="_blank" rel="noreferrer">{userInfo.linkedin}</a></div>)}
                  {userInfo.github && (<div><span className="font-medium text-gray-700">GitHub:</span> <a className="text-blue-600 hover:underline" href={userInfo.github} target="_blank" rel="noreferrer">{userInfo.github}</a></div>)}
                  {userInfo.bio && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-700">Bio:</span>
                      <p className="text-gray-900 mt-1">{userInfo.bio}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No profile found. You can create one from the Profile page.</p>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Resumes</h2>
              <Button 
                onClick={() => navigate('/resume/create')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Resume
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            {resumes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
                <p className="text-gray-500 mb-6">Create your first AI-generated resume to get started.</p>
                <Button 
                  onClick={() => navigate('/resume/create')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume, index) => (
                  <div key={resume.$id || resume.id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {resume.basics?.name || resume.name || `Resume ${index + 1}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Created {formatDate(resume.$createdAt || resume.createdAt || new Date().toISOString())}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2"> 
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/resume/view/${resume.$id || resume.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadPDF(resume.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadWord(resume.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Word
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteResume(resume.$id || resume.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
