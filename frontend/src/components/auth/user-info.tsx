'use client'

import { useSession, signOut } from 'next-auth/react'

export default function UserInfo() {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-700">
        {session.user?.email}
      </span>
      <button
        onClick={() => signOut()}
        className="rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
      >
        Sign out
      </button>
    </div>
  )
}