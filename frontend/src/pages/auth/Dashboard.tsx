import { useState } from "react"
import { Menu, LogOut, Home, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

function Dashboard() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-blue-500 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-blue-400">
          <span className="text-lg font-bold">{isOpen ? "My Dashboard" : "MD"}</span>
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-blue-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600">
            <Home className="w-5 h-5" />
            {isOpen && <span>Home</span>}
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600">
            <User className="w-5 h-5" />
            {isOpen && <span>Profile</span>}
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600">
            <Settings className="w-5 h-5" />
            {isOpen && <span>Settings</span>}
          </a>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-400">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg hover:bg-blue-600">
            <LogOut className="w-5 h-5" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
        <p className="text-gray-600 mt-2">This is your dashboard overview.</p>

        {/* Example Content Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            <p className="text-gray-600 mt-2">1,240 Active</p>
          </div>
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue</h2>
            <p className="text-gray-600 mt-2">$8,430</p>
          </div>
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
            <p className="text-gray-600 mt-2">23 Pending</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
