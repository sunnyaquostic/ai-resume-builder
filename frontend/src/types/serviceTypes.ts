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
  $id: string;          
  $createdAt: string;      
  name?: string;   
  basics?: { name?: string };  
  resume?: string;              
  phoneNumber?: number;
  skills?: string;
  yearsOfExperience?: string;
  workExperience?: string;
  certification?: string;
  github?: string;
  linkedin?: string;
  createdAt?: string;
}


export interface ResumeInfo {
  id: string;
  title: string;
  // add more fields here based on your API
}

export interface ResumeResponse {
  success: boolean;
  message: string;
  error?: string | null;
  data?: ResumeInfo[];
  loading: boolean
}

export interface ResumeState {
  loading: boolean;
  success: boolean;
  error: string | null;
  resumeInfo: ResumeInfo[];
  message: string
}

export interface UrlLink {
    url: string
}