 //C:\Users\reall\OneDrive\Desktop\Projexts\Threat Hawk VDS\frontend\src\app\temp\page.tsx

 'use client'
import SignIn from '../api/auth/signin/page'; // Import your SignIn component

export default function TempPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
            <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Temporary Sign In Page</h2>
                <SignIn />
            </div>
        </div>
    );
}
