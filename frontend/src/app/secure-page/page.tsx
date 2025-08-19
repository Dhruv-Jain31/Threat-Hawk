'use client'

import ProtectedRoute from '@/components/auth/protected-route'
import UserInfo from '@/components/auth/user-info'

export default function SecurePage() {
  return (
    <ProtectedRoute>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Secure Page</h1>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Protected Content</h2>
          <p className="mb-4">This content is only visible to authenticated users.</p>
          
          <div className="mt-8 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-2">Your Account</h3>
            <UserInfo />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}