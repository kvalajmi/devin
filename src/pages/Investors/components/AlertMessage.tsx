import React from 'react'
import { AlertState } from '../types'

interface AlertMessageProps {
  alert: AlertState
  onClose: () => void
}

const AlertMessage: React.FC<AlertMessageProps> = ({ alert, onClose }) => {
  if (!alert.show) return null

  return (
    <div className={`rounded-lg p-4 border-l-4 ${
      alert.type === 'success' 
        ? 'bg-green-50 border-green-400 text-green-800' 
        : alert.type === 'error'
        ? 'bg-red-50 border-red-400 text-red-800'
        : 'bg-yellow-50 border-yellow-400 text-yellow-800'
    }`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-lg ml-2">
            {alert.type === 'success' ? '✅' : alert.type === 'error' ? '❌' : '⚠️'}
          </span>
          <span className="font-medium">{alert.message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default AlertMessage
