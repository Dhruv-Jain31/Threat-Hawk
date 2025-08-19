'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AuthPage() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Authentication</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        
        {isLoading ? (
          <p>Loading session information...</p>
        ) : session ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 font-medium">You are signed in!</p>
            <p className="mt-2">Email: {session.user?.email}</p>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 font-medium">You are not signed in.</p>
            <Link 
              href="/auth/signin" 
              className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Authentication Pages</h2>
        <ul className="space-y-3">
          <li>
            <Link 
              href="/auth/signin" 
              className="text-blue-600 hover:underline"
            >
              Sign In Page
            </Link>
            <p className="text-gray-600 text-sm mt-1">The main sign-in page where users can enter their email.</p>
          </li>
          <li>
            <Link 
              href="/auth/verify-request" 
              className="text-blue-600 hover:underline"
            >
              Verification Request Page
            </Link>
            <p className="text-gray-600 text-sm mt-1">Shown after a user requests a sign-in link.</p>
          </li>
          <li>
            <Link 
              href="/secure-page" 
              className="text-blue-600 hover:underline"
            >
              Secure Page Example
            </Link>
            <p className="text-gray-600 text-sm mt-1">An example of a protected page that requires authentication.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}