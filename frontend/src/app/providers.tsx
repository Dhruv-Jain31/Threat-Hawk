// This directive tells Next.js that this file runs on the client side (required for using context providers like SessionProvider)
"use client"

// Import the SessionProvider from next-auth to manage user session across the app
import { SessionProvider } from "next-auth/react";

// Define the Providers component that wraps its children with SessionProvider
// This ensures that session data (user login info) is available to all child components
export function Providers({ children }: {
    children: React.ReactNode // ReactNode means any valid React content (JSX, elements, components, etc.)
}) {
    return (
        // SessionProvider fetches and provides session context (like user data, login status)
        // All components inside this wrapper can now access session using useSession()
        <SessionProvider>
            {children} {/* Render whatever component/page is passed as children */}
        </SessionProvider>
    );
}
