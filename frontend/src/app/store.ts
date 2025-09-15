// app/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import resumeReducer from "../features/serviceSlice";

const rootReducer = combineReducers({
  user: userReducer,
  resume: resumeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
