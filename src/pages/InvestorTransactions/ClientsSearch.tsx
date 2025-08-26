import React from 'react'

interface ClientsSearchProps {
  searchTerm: string
  onSearchChange: (searchTerm: string) => void
  totalClients: number
  filteredCount: number
}

/**
 * مكون البحث في العملاء
 */
const ClientsSearch: React.FC<ClientsSearchProps> = ({
  searchTerm,
  onSearchChange,
  totalClients,
  filteredCount
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            البحث في العملاء
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              placeholder="ابحث بالاسم، الرقم المدني، أو رقم الهاتف..."
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                {filteredCount}
              </span>
              <span>من أصل</span>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-medium">
                {totalClients}
              </span>
              <span>عميل</span>
            </div>
          </div>
          
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              مسح البحث
            </button>
          )}
        </div>
      </div>
      
      {searchTerm && filteredCount === 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-yellow-800 text-sm">
              لم يتم العثور على أي عملاء يطابقون البحث "{searchTerm}"
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientsSearch
