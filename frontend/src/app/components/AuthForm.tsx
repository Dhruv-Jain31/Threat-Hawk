'use client';
import { useState } from 'react';
import Link from 'next/link';

interface AuthFormProps {
    onSubmit: (email: string, password: string) => Promise<void>;
    buttonText: string;
    error: string;
    setError: (error: string) => void;
    linkText: string;
    linkHref: string;
}

export default function AuthForm({ onSubmit, buttonText, error, setError, linkText, linkHref }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (!email.includes('@')) {
            setError('Invalid email format');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            await onSubmit(email, password);
        } catch (err: any) {
            setError(err.response?.data?.error || `${buttonText} failed. Please try again.`);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h1>{buttonText}</h1>
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
                        required
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
                        required
                    />
                </div>
                <button
                    type="submit"
                    style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    {buttonText}
                </button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            <p style={{ marginTop: '15px' }}>
                {linkText} <Link href={linkHref}>{linkHref === '/auth/signin' ? 'Sign in' : 'Sign up'}</Link>
            </p>
        </div>
    );
}