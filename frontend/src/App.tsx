import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import Dashboard from './pages/auth/Dashboard'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import ProfileCreate from './pages/auth/ProfileCreate'
import Home from './pages/Home'
import Resume from './pages/service/Resume'
import ResumeCreate from './pages/service/ResumeCreate'
import DisplayResume from './pages/service/DisplayResume'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import { Provider } from 'react-redux'
import store from './app/store'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route index element={<Layout><Home /></Layout>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/create"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfileCreate />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <Layout>
              <Resume />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume/create"
        element={
          <ProtectedRoute>
            <Layout>
              <ResumeCreate />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume/view/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <DisplayResume />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Layout><div className="text-center py-20"><h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1><p className="text-gray-600">The page you're looking for doesn't exist.</p></div></Layout>} />
    </Route>
  )
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
