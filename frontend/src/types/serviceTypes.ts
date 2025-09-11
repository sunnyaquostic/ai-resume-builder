export interface RequestForm {
    title: string
    template: string
    education: string
    experience: string
    projects: string
    skills: string
    certifications: string
}

export interface ResumeInfo {
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

export interface ResumeResponse {
  success: boolean
  message: string
  error?: string | Record<string, object> | null
  resumeInfo?: ResumeInfo | ResumeInfo[] | null
  data?: ResumeInfo[]
  loading: boolean
}

export interface UrlLink {
    url: string
}