import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { 
  FileText, 
  Plus, 
  Download, 
  Eye, 
  Trash2, 
  Calendar,
  ArrowLeft,
  Search,
  Filter
} from 'lucide-react';
import type { RootState, AppDispatch } from '../../app/store';
import { removeErrors, removeSuccess } from '../../features/serviceSlice';
import { getResume, DeleteResume, resumePdf, resumeWord } from '../../features/serviceSlice';
import Loader from '../../components/Loader';
import { Button } from '../../components/ui/button';

interface ResumeData {
  id?: string;
  $id?: string;
  title?: string;
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  professionalsummary?: string;
  skills?: string;
  workexperience?: string;
  projects?: string;
  education?: string;
  certifications?: string;
  resume?: string;
  $createdAt?: string;
  createdAt?: string;
  user_id?: string;
  error?: string;
}

function Resume() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, success, error, resumeInfo } = useSelector((state: RootState) => state.resume)
  const { userInfo } = useSelector((state: RootState) => state.user)
  const [resumes, setResumes] = useState<ResumeData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredResumes, setFilteredResumes] = useState<ResumeData[]>([])

  useEffect(() => {
    // Fetch user's resumes when component mounts
    dispatch(getResume())
  }, [dispatch])

  useEffect(() => {
    if (success && resumeInfo) {
      // Handle different response structures
      if (Array.isArray(resumeInfo)) {
        setResumes(resumeInfo)
        setFilteredResumes(resumeInfo)
      } else if (resumeInfo.data && Array.isArray(resumeInfo.data)) {
        setResumes(resumeInfo.data)
        setFilteredResumes(resumeInfo.data)
      }
    }
  }, [success, resumeInfo])

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to load resumes')
    }
  }, [error])

  useEffect(() => {
    // Filter resumes based on search term
    const filtered = resumes.filter(resume => 
      resume.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredResumes(filtered)
  }, [searchTerm, resumes])

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
    <main className="w-full min-h-[100vh] h-auto bg-gradient-to-br from-blue-50 to-indigo-100 py-12 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h1>
              <p className="text-gray-600">Manage and download your AI-generated resumes</p>
            </div>
            <Button 
              onClick={() => navigate('/resume/create')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Resume
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resumes by title, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>{filteredResumes.length} of {resumes.length} resumes</span>
            </div>
          </div>
        </div>

        {/* Resumes Grid */}
        {filteredResumes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No resumes found' : 'No resumes yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Create your first AI-generated resume to get started'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => navigate('/resume/create')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Resume
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume, index) => (
              <div key={resume.$id || resume.id || index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-6">
                  {/* Resume Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {resume.title || `Resume ${index + 1}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {resume.name || 'Untitled Resume'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Resume Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Created {formatDate(resume.$createdAt || resume.createdAt || new Date().toISOString())}</span>
                    </div>
                    {resume.email && (
                      <div className="text-sm text-gray-600 truncate">
                        {resume.email}
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-semibold text-gray-900">
                        {[
                          resume.professionalsummary,
                          resume.skills,
                          resume.workexperience,
                          resume.projects,
                          resume.education,
                          resume.certifications
                        ].filter(Boolean).length}
                      </div>
                      <div className="text-xs text-gray-500">Sections</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-semibold text-gray-900">
                        {resume.resume?.split(' ').length || 0}
                      </div>
                      <div className="text-xs text-gray-500">Words</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => navigate(`/resume/view/${resume.$id || resume.id}`)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Resume
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(resume.$id || resume.id)}
                        className="text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadWord(resume.$id || resume.id)}
                        className="text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Word
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteResume(resume.$id || resume.id)}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </main>
  )
}

export default Resume
