'use client';

import { useState } from 'react';
import { useApi } from '../../hooks/useApi';

export default function NewScanPage() {
    const [target, setTarget] = useState('');
    const [scanType, setScanType] = useState('WEB');
    const { apiCall, loading } = useApi();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const result = await apiCall('/api/scan-and-scrape', {
            method: 'POST',
            body: JSON.stringify({ target, type: scanType }),
        });

        if (result.error) {
            alert(`Error: ${result.error}`);
        } else {
            alert('Scan started successfully!');
            setTarget('');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">New Security Scan</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Target URL
                    </label>
                    <input
                        type="url"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="https://example.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Scan Type
                    </label>
                    <select
                        value={scanType}
                        onChange={(e) => setScanType(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="WEB">Web Application Scan</option>
                        <option value="WEB_DEEP">Deep Web Scan</option>
                        <option value="NETWORK">Network Scan</option>
                        <option value="NETWORK_DEEP">Deep Network Scan</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Starting Scan...' : 'Start Scan'}
                </button>
            </form>
        </div>
    );
}
