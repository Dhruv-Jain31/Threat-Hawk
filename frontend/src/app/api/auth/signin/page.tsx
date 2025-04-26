'use client'
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });
        if (result?.error) {
            setError(result.error);
        } else {
            window.location.href = '/';
        }
    };

    return (
        <div className={"bg-amber-400"}>
            <h1>Sign In</h1>
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
                    Sign In
                </button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            <div style={{ marginTop: '15px' }}>
                <button
                    onClick={() => signIn('google')}
                    style={{ padding: '10px 20px', background: '#db4437', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px' }}
                >
                    Sign in with Google
                </button>
                <button
                    onClick={() => signIn('github')}
                    style={{ padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    Sign in with GitHub
                </button>
            </div>
            <p style={{ marginTop: '15px' }}>
                Don’t have an account? <Link href="/register">Sign up</Link>
            </p>
        </div>
    );
}