import { configureStore } from "@reduxjs/toolkit";
import userSlice from '../features/userSlice'
import resumeSlice from '../features/serviceSlice'

const store = configureStore({
    reducer: {
        user: userSlice,
        resume:resumeSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store