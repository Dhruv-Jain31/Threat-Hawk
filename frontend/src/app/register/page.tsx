'use client'
import Signup from '../api/auth/signup/page'; // Import your Signup component

export default function RegisterPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
            <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Your Account</h2>
                <Signup />
            </div>
        </div>
    );
}
