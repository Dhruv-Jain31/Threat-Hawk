"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaFolderOpen, FaPlusCircle } from "react-icons/fa"; // Importing React Icons

const DashboardLayout = ({ children }: any) => {
  const pathname = usePathname();

  // Define the navigation items
  const navItems = [
    { label: "Home", href: "/", icon: FaHome },
    { label: "New Scan", href: "/new-scan", icon: FaPlusCircle },
    { label: "Your Scans", href: "/your-scans", icon: FaFolderOpen },
  ];

  return (
    <div className="flex h-screen text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-6 border-r border-gray-800">
        <h2 className="text-3xl font-bold text-white mb-8">Scanner Dashboard</h2>
        <nav>
          <ul className="space-y-6">
            {navItems.map(({ href, label, icon: Icon }, index) => (
              <li key={index}>
                <Link
                  href={href}
                  className={`flex items-center text-lg gap-3 px-2 py-2 rounded transition duration-200 hover:text-indigo-300 ${
                    pathname === href ? "text-indigo-300 font-semibold" : "text-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 text-gray-900 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;


//C:\Users\reall\OneDrive\Desktop\Projexts\Threat Hawk VDS\frontend\src\app\dashboard\layout.tsx