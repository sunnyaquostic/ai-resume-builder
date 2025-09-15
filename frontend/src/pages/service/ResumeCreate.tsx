import { FormEvent, useEffect, useState, type ChangeEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { FileText, GraduationCap, Award, Code, ArrowLeft, Wand2 } from 'lucide-react';
import type { RootState, AppDispatch } from '../../app/store';
import { removeErrors, removeSuccess } from '../../features/serviceSlice';
import { createResume } from '../../features/serviceSlice';
import Loader from '../../components/Loader';
import { Button } from '../../components/ui/button';

interface ResumeFormData {
  title: string;
  template: string;
  education: string;
  experience: string;
  projects: string;
  skills: string;
  certifications: string;
}

function ResumeCreate() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, success, error, resumeInfo } = useSelector((state: RootState) => state.resume)
  const { userInfo } = useSelector((state: RootState) => state.user)
  
  const [formData, setFormData] = useState<ResumeFormData>({
    title: '',
    template: 'modern-2',
    education: '',
    experience: '',
    projects: '',
    skills: '',
    certifications: ''
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    if (error) {
      const message = typeof error === "string" ? error : JSON.stringify(error)
      toast.error(message, {position:'top-center', autoClose:3000})
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  useEffect(() => {
    if (success && resumeInfo) {
      toast.success('Resume created successfully!', {position:'top-center', autoClose:3000})
      dispatch(removeSuccess())
      navigate(`/resume/view/${resumeInfo.id || resumeInfo.$id}`)
    }
  }, [dispatch, success, resumeInfo, navigate])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Resume title is required', {position:'top-center', autoClose:3000})
      return
    }

    if (!formData.education.trim()) {
      toast.error('Education information is required', {position:'top-center', autoClose:3000})
      return
    }

    if (!formData.experience.trim()) {
      toast.error('Work experience is required', {position:'top-center', autoClose:3000})
      return
    }

    if (!formData.skills.trim()) {
      toast.error('Skills are required', {position:'top-center', autoClose:3000})
      return
    }

    dispatch(createResume(formData))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Resume Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineer Resume"
                    required
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
                    Template Style
                  </label>
                  <select
                    id="template"
                    name="template"
                    value={formData.template}
                    onChange={handleChange}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="modern-1">Modern Style 1</option>
                    <option value="modern-2">Modern Style 2</option>
                    <option value="modern-3">Modern Style 3</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Education & Experience
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                    Education *
                  </label>
                  <textarea
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="Include your degrees, institutions, graduation years, and any relevant academic achievements..."
                    rows={4}
                    required
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Work Experience *
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Include your job titles, companies, dates, and key responsibilities and achievements..."
                    rows={4}
                    required
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-600" />
                Skills & Projects
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                    Skills *
                  </label>
                  <textarea
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="List your technical skills, programming languages, tools, and technologies..."
                    rows={3}
                    required
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>
                <div>
                  <label htmlFor="projects" className="block text-sm font-medium text-gray-700 mb-2">
                    Projects
                  </label>
                  <textarea
                    id="projects"
                    name="projects"
                    value={formData.projects}
                    onChange={handleChange}
                    placeholder="Describe your key projects, including technologies used and your role..."
                    rows={3}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Certifications & Final Review
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-2">
                    Certifications
                  </label>
                  <textarea
                    id="certifications"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    placeholder="List any relevant certifications, licenses, or professional qualifications..."
                    rows={3}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Review Your Information</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Title:</strong> {formData.title || 'Not specified'}</p>
                    <p><strong>Template:</strong> {formData.template}</p>
                    <p><strong>Education:</strong> {formData.education ? 'Provided' : 'Missing'}</p>
                    <p><strong>Experience:</strong> {formData.experience ? 'Provided' : 'Missing'}</p>
                    <p><strong>Skills:</strong> {formData.skills ? 'Provided' : 'Missing'}</p>
                    <p><strong>Projects:</strong> {formData.projects ? 'Provided' : 'Not specified'}</p>
                    <p><strong>Certifications:</strong> {formData.certifications ? 'Provided' : 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <main className="w-full min-h-[100vh] h-auto bg-gradient-to-br from-blue-50 to-indigo-100 py-12 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">AR</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Resume</h1>
          <p className="text-gray-600">Let AI help you build a professional resume in minutes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    <div className="text-sm">
                      <p className={`font-medium ${
                        step <= currentStep ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step === 1 && 'Basic Info'}
                        {step === 2 && 'Education & Experience'}
                        {step === 3 && 'Skills & Projects'}
                        {step === 4 && 'Certifications & Review'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Wand2 className="h-4 w-4 text-blue-600" />
                  <span>AI-Powered Generation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
              {renderStepContent()}

              <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/resume')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Resumes
                </Button>

                <div className="flex gap-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                    >
                      Previous
                    </Button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? 'Generating Resume...' : 'Generate Resume'}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ResumeCreate

