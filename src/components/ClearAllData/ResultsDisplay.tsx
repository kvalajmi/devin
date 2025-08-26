import React from 'react'

interface ResultsDisplayProps {
  results: string[]
}

/**
 * مكون عرض النتائج
 */
const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (results.length === 0) return null

  const getResultStyle = (result: string): string => {
    if (result.startsWith('✅')) return 'text-green-700'
    if (result.startsWith('❌')) return 'text-red-700'
    if (result.startsWith('ℹ️')) return 'text-blue-700'
    if (result.startsWith('📊') || result.startsWith('🚀') || result.startsWith('🎉')) {
      return 'text-purple-700 font-bold'
    }
    if (result.startsWith('⚠️')) return 'text-orange-700 font-bold'
    return 'text-gray-700'
  }

  const getResultIcon = (result: string): string => {
    if (result.startsWith('✅')) return '✅'
    if (result.startsWith('❌')) return '❌'
    if (result.startsWith('ℹ️')) return 'ℹ️'
    if (result.startsWith('🚀')) return '🚀'
    if (result.startsWith('🎉')) return '🎉'
    if (result.startsWith('⚠️')) return '⚠️'
    return '•'
  }

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg border max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-gray-800">نتائج عملية الحذف:</h4>
        <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
          {results.length} عملية
        </span>
      </div>
      
      <div className="space-y-2">
        {results.map((result, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2 space-x-reverse p-2 rounded ${
              result.startsWith('✅') ? 'bg-green-50' :
              result.startsWith('❌') ? 'bg-red-50' :
              result.startsWith('🎉') ? 'bg-purple-50' :
              'bg-white'
            } transition-all duration-200`}
          >
            <span className="text-lg flex-shrink-0 mt-0.5">
              {getResultIcon(result)}
            </span>
            <span className={`font-mono text-sm flex-1 ${getResultStyle(result)}`}>
              {result.replace(/^[✅❌ℹ️📊🚀🎉⚠️]\s*/, '')}
            </span>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {new Date().toLocaleTimeString('ar-KW', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        ))}
      </div>
      
      {/* ملخص النتائج */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-100 p-2 rounded">
            <div className="text-lg font-bold text-green-700">
              {results.filter(r => r.startsWith('✅')).length}
            </div>
            <div className="text-xs text-green-600">نجحت</div>
          </div>
          <div className="bg-red-100 p-2 rounded">
            <div className="text-lg font-bold text-red-700">
              {results.filter(r => r.startsWith('❌')).length}
            </div>
            <div className="text-xs text-red-600">فشلت</div>
          </div>
          <div className="bg-blue-100 p-2 rounded">
            <div className="text-lg font-bold text-blue-700">
              {results.filter(r => r.startsWith('ℹ️')).length}
            </div>
            <div className="text-xs text-blue-600">معلومات</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsDisplay
