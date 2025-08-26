import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Investors from './pages/Investors'
import InvestorTransactions from './pages/InvestorTransactions'
import ClientDetails from './pages/ClientDetails'
import ProfitDistributions from './pages/ProfitDistributions'
import ExcelImport from './components/ExcelImport'
import ClearAllData from './components/ClearAllData'
import { ConfirmationProvider } from './components/ConfirmationProvider'



function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ConfirmationProvider>
      <Router future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}>
        <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <h1 className="text-xl font-semibold text-gray-900">نظام إدارة البيانات</h1>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/investors" element={<Investors />} />
                <Route path="/investor-transactions/:id" element={<InvestorTransactions />} />
                <Route path="/client-details/:clientId" element={<ClientDetails />} />
                <Route path="/profit-distributions" element={<ProfitDistributions />} />
                <Route path="/investor-import/:investorId" element={<ExcelImport />} />
                <Route path="/clear-all-data" element={<ClearAllData />} />

                <Route path="*" element={<Dashboard />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
      </Router>
    </ConfirmationProvider>
  )
}

export default App
