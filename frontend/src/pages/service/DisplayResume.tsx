import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Download, 
  Edit, 
  Trash2, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github,
  Calendar,
  Award,
  Code,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import type { RootState, AppDispatch } from '../../app/store';
import { removeErrors, removeSuccess } from '../../features/serviceSlice';
import { getSingleResume, DeleteResume, resumePdf, resumeWord } from '../../features/serviceSlice';
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
}

function DisplayResume() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  const { loading, success, error, resumeInfo } = useSelector((state: RootState) => state.resume)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)

  useEffect(() => {
    if (id) {
      dispatch(getSingleResume(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (success && resumeInfo) {
      setResumeData(resumeInfo)
    }
  }, [success, resumeInfo])

  useEffect(() => {
    if (error) {
      const message = typeof error === "string" ? error : JSON.stringify(error)
      toast.error(message, {position:'top-center', autoClose:3000})
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      if (resumeData?.id || resumeData?.$id) {
        dispatch(DeleteResume(resumeData.id || resumeData.$id))
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }
    }
  }

  const handleDownloadPDF = () => {
    if (resumeData?.id || resumeData?.$id) {
      dispatch(resumePdf(resumeData.id || resumeData.$id))
    }
  }

  const handleDownloadWord = () => {
    if (resumeData?.id || resumeData?.$id) {
      dispatch(resumeWord(resumeData.id || resumeData.$id))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderSection = (title: string, content: string | undefined, icon: React.ReactNode) => {
    if (!content || content.trim() === '') return null

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
            {content}
          </pre>
        </div>
      </div>
    )
  }

  if (loading) {
    return <Loader />
  }

  if (!resumeData) {
    return (
      <main className="w-full min-h-[100vh] h-auto bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Resume Not Found</h2>
          <p className="text-gray-600 mb-6">The resume you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
            Back to Dashboard
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full min-h-[100vh] h-auto bg-gradient-to-br from-blue-50 to-indigo-100 py-12 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {resumeData.title || 'Resume'}
                </h1>
                <p className="text-gray-600">
                  Created {formatDate(resumeData.$createdAt || resumeData.createdAt || new Date().toISOString())}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadPDF}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadWord}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Word
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resume Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Header Section */}
              <div className="text-center mb-8 pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {resumeData.name || 'Your Name'}
                </h2>
                
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  {resumeData.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{resumeData.email}</span>
                    </div>
                  )}
                  {resumeData.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{resumeData.phone}</span>
                    </div>
                  )}
                  {resumeData.linkedin && (
                    <div className="flex items-center gap-1">
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </div>
                  )}
                  {resumeData.github && (
                    <div className="flex items-center gap-1">
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume Content */}
              <div className="space-y-6">
                {renderSection(
                  'Professional Summary',
                  resumeData.professionalsummary,
                  <User className="h-5 w-5 text-blue-600" />
                )}

                {renderSection(
                  'Skills',
                  resumeData.skills,
                  <Code className="h-5 w-5 text-blue-600" />
                )}

                {renderSection(
                  'Work Experience',
                  resumeData.workexperience,
                  <Briefcase className="h-5 w-5 text-blue-600" />
                )}

                {renderSection(
                  'Projects',
                  resumeData.projects,
                  <FileText className="h-5 w-5 text-blue-600" />
                )}

                {renderSection(
                  'Education',
                  resumeData.education,
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                )}

                {renderSection(
                  'Certifications',
                  resumeData.certifications,
                  <Award className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Resume Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Title:</span>
                    <span className="font-medium">{resumeData.title || 'Untitled'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {formatDate(resumeData.$createdAt || resumeData.createdAt || new Date().toISOString())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleDownloadPDF}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={handleDownloadWord}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Word
                  </Button>
                  <Button
                    onClick={() => navigate('/resume/create')}
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Create New Resume
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sections:</span>
                    <span className="font-medium">
                      {[
                        resumeData.professionalsummary,
                        resumeData.skills,
                        resumeData.workexperience,
                        resumeData.projects,
                        resumeData.education,
                        resumeData.certifications
                      ].filter(Boolean).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Word Count:</span>
                    <span className="font-medium">
                      {resumeData.resume?.split(' ').length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DisplayResume
