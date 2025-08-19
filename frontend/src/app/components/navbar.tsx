'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">ThreatHawk</Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/' ? 'bg-gray-800' : 'hover:bg-gray-700'}`}
              >
                Home
              </Link>
              
              <Link 
                href="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/dashboard') ? 'bg-gray-800' : 'hover:bg-gray-700'}`}
              >
                Dashboard
              </Link>
              
              <Link 
                href="/secure-page" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/secure-page' ? 'bg-gray-800' : 'hover:bg-gray-700'}`}
              >
                Secure Page
              </Link>
              
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth/signin"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}