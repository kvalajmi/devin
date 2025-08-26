import React from 'react'

interface ErrorMessageProps {
  error: string
}

/**
 * مكون عرض رسائل الخطأ
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null

  return (
    <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-2">
      {error}
    </div>
  )
}

export default ErrorMessage
