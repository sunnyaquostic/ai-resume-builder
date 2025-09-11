import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import type { RootState, AppDispatch } from '../../app/store'
import { getSingleResume, resumePdf, resumeWord, removeErrors } from '../../features/serviceSlice'
import Loader from '../../components/Loader'
import { Button } from '../../components/ui/button'
import { ArrowLeft, Download, FileText } from 'lucide-react'

function DisplayResume() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, success, resumeInfo, message } = useSelector((state: RootState) => state.resume)

  useEffect(() => {
    if (id) {
      dispatch(getSingleResume(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to load resume')
      dispatch(removeErrors())
    }
  }, [error, dispatch])

  const handleDownloadPDF = () => {
    if (!id) return
    dispatch(resumePdf(id))
  }

  const handleDownloadWord = () => {
    if (!id) return
    dispatch(resumeWord(id))
  }

  if (loading) return <Loader />

  // Normalize resume object variants
  const resume: any = Array.isArray(resumeInfo) ? resumeInfo[0] : resumeInfo

  return (
    <main className="w-full min-h-[100vh] h-auto bg-gradient-to-br from-blue-50 to-indigo-100 py-12 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{resume?.title || 'Resume'}</h1>
                <p className="text-sm text-gray-500">{resume?.name || resume?.email || ''}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/resume')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button variant="outline" onClick={handleDownloadPDF} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" onClick={handleDownloadWord} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Word
              </Button>
            </div>
          </div>
        </div>

        {/* Resume Body */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {resume?.resume ? (
            <div className="prose max-w-none whitespace-pre-wrap leading-7 text-gray-800">
              {resume.resume}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No resume content found.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default DisplayResume