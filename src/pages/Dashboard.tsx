import React from 'react'

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Welcome Section */}
      <div className="card">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            مرحباً بك في نظام هارموني
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            نظام متكامل لإدارة المستثمرين والمشاريع
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
            <span className="text-sm font-medium">نظام حديث وسهل الاستخدام</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
          <div className="text-gray-600">إجمالي المستثمرين</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">0</div>
          <div className="text-gray-600">المشاريع النشطة</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
          <div className="text-gray-600">التقارير</div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">ابدأ باستخدام النظام</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <div className="flex items-center mb-2">
              <span className="text-2xl ml-2">👥</span>
              <h3 className="font-medium">إدارة المستثمرين</h3>
            </div>
            <p className="text-gray-600 text-sm">أضف وأعدل بيانات المستثمرين</p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <div className="flex items-center mb-2">
              <span className="text-2xl ml-2">📊</span>
              <h3 className="font-medium">إدارة المشاريع</h3>
            </div>
            <p className="text-gray-600 text-sm">تابع المشاريع وحالة تقدمها</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
