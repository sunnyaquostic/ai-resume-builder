import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import type { ResumeResponse, RequestForm, UrlLink } from '../types/serviceTypes'

export const createResume = createAsyncThunk<ResumeResponse, RequestForm, {rejectValue: string}>(
    "resume/create",
    async (RequestForm, {rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const { data } = await axios.post<ResumeResponse>('/resume/create', RequestForm, config)
            return data
         } catch (err) {
            console.log("error while creating the resuming: ", err);
            return rejectWithValue(String(err) || 'error occured while generating resuming')
            
        }
    }
)

export const getResume = createAsyncThunk<ResumeResponse, void, {rejectValue: string}>(
    "resume/get",
    async (_, {rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const { data } = await axios.get<ResumeResponse>('/resume/get', config)
            return data
         } catch (err) {
            console.log("error while retriving resuming: ", err);
            return rejectWithValue(String(err) || 'error occured while retriving resuming')
            
        }
    }
)

export const getSingleResume = createAsyncThunk<ResumeResponse, string, {rejectValue: string}>(
    "resume/getsingle",
    async (resume_id, {rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const { data } = await axios.get<ResumeResponse>(`/resume/get/${resume_id}`, config)
            return data
         } catch (err) {
            console.log("Could not find a cv with id: ${resume_id}: ", err);
            return rejectWithValue(String(err) || `Could not find a cv with id: ${resume_id}`)
            
        }
    }
)

export const DeleteResume = createAsyncThunk<ResumeResponse, string, {rejectValue: string}>(
    "resume/delete",
    async (resume_id, {rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const { data } = await axios.delete<ResumeResponse>(`/resume/delete/${resume_id}`, config)
            return data
         } catch (err) {
            console.log("Could not find a cv with id: ${resume_id}: ", err);
            return rejectWithValue(String(err) || `Could not find a cv with id: ${resume_id}`)
            
        }
    }
)

export const resumePdf = createAsyncThunk<UrlLink, string, {rejectValue: string}>(
    "resume/pdf",
    async (resume_id, {rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/pdf"
                }
            }

            const { data } = await axios.get<UrlLink>(`/resume/pdf/${resume_id}`, config)
            return data
         } catch (err) {
            console.log("Could not generate the pdf: ", err);
            return rejectWithValue(String(err) || `Could not generate the pdf for doc with id: ${resume_id}`)
            
        }
    }
)

export const resumeWord = createAsyncThunk<UrlLink, string, {rejectValue: string}>(
    "resume/resume-word",
    async (resume_id, {rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/docx"
                }
            }

            const { data } = await axios.get<UrlLink>(`/resume/pdf/${resume_id}`, config)
            return data
         } catch (err) {
            console.log("Could not generate the pdf: ", err);
            return rejectWithValue(String(err) || `Could not generate the pdf for doc with id: ${resume_id}`)
            
        }
    }
)

const initialState: ResumeResponse =  {
    success: false,
    error: null,
    message: '',
    resumeInfo: null,
    loading: false
}

const resumeSlice = createSlice({
    name: "resume",
    initialState,
    reducers: {
        removeErrors: (state) => {
            state.error = null
        },

        removeSuccess: (state) => {
            state.success = false
        }
    },

    extraReducers: (builder) => {
        builder.addCase(createResume.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createResume.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload?.success
            state.error = null;
            state.message = action.payload?.message || "Resume created successfully";
            state.resumeInfo = action.payload.resumeInfo || null;
        })
        .addCase(createResume.rejected, (state) => {
            state.loading = false;
            state.error = "Error occured!"
        })

        builder.addCase(getResume.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(getResume.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.message = action.payload?.message || "All CV's fetched!"
            state.resumeInfo = action.payload?.resumeInfo || null
            state.error = null
        })
        .addCase(getResume.rejected, (state) => {
            state.loading = false
            state.error = 'Failed to fetch CV\'s'
        })

        builder.addCase(getSingleResume.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getSingleResume.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.message = action.payload?.message || "Fetch cv ";
            state.resumeInfo = action.payload?.resumeInfo || null
            state.error = null;
        })
        .addCase(getSingleResume.rejected, (state) => {
            state.loading = false;
            state.error = "Something went wrong with fetching single id"
        })

        builder.addCase(DeleteResume.pending, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addCase(DeleteResume.fulfilled, (state, action) => {
            state.loading = true;
            state.error = null;
            state.success = true;
            state.message = action.payload?.message || "Document deleted successfully";
            state.resumeInfo = action.payload?.resumeInfo || null
        })
        .addCase(DeleteResume.rejected, (state) => {
            state.loading = false;
            state.error = "An error occured deleting the document"
        })

        builder.addCase(resumePdf.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(resumePdf.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true
            state.error = null;
            state.message = 'Pdf generated successfully!';
            state.resumeInfo = action.payload
        })
        .addCase(resumePdf.rejected, (state) => {
            state.loading = false;
            state.error = "An Error occured generating the pdf"
        })
    }
})

export const { removeErrors, removeSuccess } = resumeSlice.actions;
export default resumeSlice.reducer;