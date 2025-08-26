import React from 'react'

interface ModalHeaderProps {
  title: string
}

/**
 * رأس النافذة المنبثقة
 */
const ModalHeader: React.FC<ModalHeaderProps> = ({ title }) => {
  return (
    <div className="mb-4 flex items-center">
      <div className="text-2xl ml-3">✏️</div>
      <h3
        id="modal-title"
        className="text-lg font-semibold text-blue-800"
      >
        {title}
      </h3>
    </div>
  )
}

export default ModalHeader
