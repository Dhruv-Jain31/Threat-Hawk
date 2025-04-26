'use client'
import { useState } from 'react';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Call the register endpoint
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000'}/api/auth/register`,
                { email, password },
                { headers: { 'Content-Type': 'application/json' } }
            );

            // Sign in after successful registration
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                window.location.href = '/'; // Redirect to homepage
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    Sign Up
                </button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            <p style={{ marginTop: '15px' }}>
                Already have an account? <Link href="/auth/signin">Sign in</Link>
            </p>
        </div>
    );
}