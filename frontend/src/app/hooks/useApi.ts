'use client';

import { useSession } from 'next-auth/react';
import { useState, useCallback } from 'react';

interface ApiResponse<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export const useApi = () => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    const apiCall = useCallback(async <T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> => {
        if (!session) {
            return { data: null, loading: false, error: 'Not authenticated' };
        }

        setLoading(true);
        try {
            // Get access token
            const tokenResponse = await fetch('/api/get-token');
            const { accessToken } = await tokenResponse.json();

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'API request failed');
            }

            const data = await response.json();
            return { data, loading: false, error: null };
        } catch (error: any) {
            return { data: null, loading: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, [session]);

    return { apiCall, loading };
};
