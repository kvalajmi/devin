import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'الرئيسية', icon: '🏠' },
    { path: '/investors', label: 'قسم المستثمرين', icon: '👥' },
    { path: '/profit-distributions', label: 'توزيعات الأرباح', icon: '💰' },
    { path: '/clear-all-data', label: 'حذف جميع البيانات', icon: '🗑️' },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-center leading-tight">
            أهلاً بك في<br />
            <span className="text-gray-300">عالم هارموني</span>
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:shadow-lg
                    ${location.pathname === item.path ? 'bg-gray-700 shadow-lg' : ''}
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl ml-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-gray-700">
          <div className="text-center text-gray-300 text-sm">
            نظام هارموني للإدارة
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
