import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { ResumeResponse, ResumeState, UrlLink, RequestForm } from '../types/serviceTypes'
import api from '@/api'

export const createResume = createAsyncThunk<ResumeResponse, RequestForm, {rejectValue: string}>(
    "resume/create",
    async (RequestForm, {rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const { data } = await api.post<ResumeResponse>('/v1/resume/create', RequestForm, config)
            return data
         } catch (err) {
            console.log("error while creating the resuming: ", err);
            return rejectWithValue(String(err) || 'error occured while generating resuming')
            
        }
    }
)

export const getResume = createAsyncThunk<ResumeResponse, void, { rejectValue: string }>(
  "resume/get",
  async (_, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await api.get<ResumeResponse>("/v1/resumes", config);

      console.log("API raw response:", data);
      return data;
    } catch (err) {
      console.log("error while retrieving resumes: ", err);
      return rejectWithValue(
        String(err) || "error occurred while retrieving resumes"
      );
    }
  }
);

export const getSingleResume = createAsyncThunk<ResumeResponse, string, {rejectValue: string}>(
    "resume/getsingle",
    async (resume_id, {rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const { data } = await api.get<ResumeResponse>(`/v1/resume/get/${resume_id}`, config)
            return data
         } catch (err) {
            console.log("Could not find a cv with id: ${resume_id}: ", err);
            return rejectWithValue(String(err) || `Could not find a cv with id: ${resume_id}`)
            
        }
    }
)

export const DeleteResume = createAsyncThunk<
  { success: boolean; message: string },
  string,
  { rejectValue: string }
>("resume/delete", async (resumeId, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/v1/resumes/${resumeId}`);
    return data;
  } catch (err) {
    console.log(err)
    return rejectWithValue("Failed to delete resume");
  }
});


export const resumePdf = createAsyncThunk<UrlLink, string, {rejectValue: string}>(
    "resume/pdf",
    async (resume_id, {rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/pdf"
                }
            }

            const { data } = await api.get<UrlLink>(`/v1/resume/pdf/${resume_id}`, config)
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
                    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                }
            }

            const { data } = await api.get<UrlLink>(`/v1/resume/word/${resume_id}`, config)
            return data
         } catch (err) {
            console.log("Could not generate the word document: ", err);
            return rejectWithValue(String(err) || `Could not generate the word document for doc with id: ${resume_id}`)
            
        }
    }
)

const initialState: ResumeState = {
  loading: false,
  success: false,
  message: "",
  error: null,
  resumeInfo: []
};

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
            state.resumeInfo = action.payload.data || [];
        })
        .addCase(createResume.rejected, (state) => {
            state.loading = false;
            state.error = "Error occured!"
        })

        builder.addCase(getResume.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase(getResume.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.resumeInfo = action.payload.data || [];
        })
        .addCase(getResume.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload || "Failed to fetch resumes";
            state.resumeInfo = [];
        });

        builder.addCase(getSingleResume.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase(getSingleResume.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.message = action.payload?.message || "Fetched resume successfully";
            state.resumeInfo = action.payload?.data || null;
            state.error = null;
        })
        .addCase(getSingleResume.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = (action.payload as string) || "Something went wrong fetching the resume by ID";
        })

        builder.addCase(DeleteResume.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase(DeleteResume.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.message = action.payload?.message || "Document deleted successfully";
            state.resumeInfo = [];
        })
        .addCase(DeleteResume.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error =
            (action.payload as string) ||
            "An error occurred deleting the document";
        })

        // builder.addCase(resumePdf.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        //     state.success = false;
        // })
        // .addCase(resumePdf.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.success = true;
        //     state.error = null;
        //     state.message = "PDF generated successfully!";
        //     state.resumeInfo = action.payload || null;
        // })
        // .addCase(resumePdf.rejected, (state, action) => {
        //     state.loading = false;
        //     state.success = false;
        //     state.error =
        //     (action.payload as string) ||
        //     "An error occurred generating the PDF";
        // });
    }
})

export const { removeErrors, removeSuccess } = resumeSlice.actions;
export default resumeSlice.reducer;