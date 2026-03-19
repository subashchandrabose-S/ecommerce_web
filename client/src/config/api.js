// API Configuration
// Supports: Development (localhost), Vercel (same domain), Render (external URL)

const getApiUrl = () => {
    let url = import.meta.env.VITE_API_URL;
    
    if (url) {
        // Remove trailing slash if present
        url = url.endsWith('/') ? url.slice(0, -1) : url;
        
        // If the URL doesn't end with /api, append it (assuming it's the main domain)
        if (!url.endsWith('/api') && url.includes('vercel.app')) {
            url = `${url}/api`;
        }
        return url;
    }

    // In production without explicit URL (Vercel - same domain)
    if (import.meta.env.PROD) {
        return '/api';
    }
    
    // In development, use localhost backend
    return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiUrl()

