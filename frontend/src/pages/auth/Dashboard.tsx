import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Menu, LogOut, Home, User, Settings, FileText, Plus, Download, Eye, Trash2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RootState, AppDispatch } from '../../app/store'
import { getResume, DeleteResume, resumePdf, resumeWord } from '../../features/serviceSlice'
import { LogoutUser } from '../../features/userSlice'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'

function Dashboard() {
  const [isOpen, setIsOpen] = useState(true)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  
  const { loading, success, error, resumeInfo } = useSelector((state: RootState) => state.resume)
  const { userInfo } = useSelector((state: RootState) => state.user)
  const [resumes, setResumes] = useState<any[]>([])

  useEffect(() => {
    // Fetch user's resumes when component mounts
    dispatch(getResume())
  }, [dispatch])

  useEffect(() => {
    if (success && resumeInfo) {
      // Handle different response structures
      if (Array.isArray(resumeInfo)) {
        setResumes(resumeInfo)
      } else if (resumeInfo.data && Array.isArray(resumeInfo.data)) {
        setResumes(resumeInfo.data)
      }
    }
  }, [success, resumeInfo])

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to load resumes')
    }
  }, [error])

  const handleDeleteResume = (resumeId: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      dispatch(DeleteResume(resumeId))
      // Refresh the list after deletion
      setTimeout(() => {
        dispatch(getResume())
      }, 1000)
    }
  }

  const handleDownloadPDF = (resumeId: string) => {
    dispatch(resumePdf(resumeId))
  }

  const handleDownloadWord = (resumeId: string) => {
    dispatch(resumeWord(resumeId))
  }

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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors">
            <Home className="w-5 h-5" />
            {isOpen && <span>Overview</span>}
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600">
            <FileText className="w-5 h-5" />
            {isOpen && <span>My Resumes</span>}
          </a>
          <a href="/profile/create" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors">
            <User className="w-5 h-5" />
            {isOpen && <span>Profile</span>}
          </a>
        </nav>

        {/* Logout */}
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

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userInfo?.name || 'User'}!
          </h1>
          <p className="text-gray-600">Manage your AI-generated resumes and create new ones.</p>
        </div>

        {/* Stats Cards */}
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

        {/* Resumes List */}
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
                        onClick={() => handleDownloadPDF(resume.$id || resume.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadWord(resume.$id || resume.id)}
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
