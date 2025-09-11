export interface RequestForm {
    name: string
    phoneNumber: string
    email: string
    skills: object
    yearsOfExperience: number
    workExperience: object
    certification: object
    github: string | ''
    linkedin: string | ''
}

export interface ResumeInfo {
    id: string;
    name: string;
    phoneNumber: number;
    skills: string;
    yearsOfExperience?: string
    workExperience?: string
    certification?: string
    github?: string
    linkedin?: string
}

export interface ResumeResponse {
  success: boolean
  message: string
  error?: string | Record<string, object> | null
  resumeInfo?: ResumeInfo | null
  loading: boolean
}

export interface UrlLink {
    url: string
}