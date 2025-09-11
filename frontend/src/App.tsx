import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import Dashboard from './pages/auth/Dashboard'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import ProfileCreate from './pages/auth/ProfileCreate'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import { Provider } from 'react-redux'
import store from './app/store'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path='/'>
      <Route index element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/create"
        element={
          <ProtectedRoute>
            <ProfileCreate />
          </ProtectedRoute>
        }
      /> 
      <Route path="*" element={<div>Not Found</div>} />
    </Route>
  ])
)

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer />
    </Provider>
  )
}

export default App
