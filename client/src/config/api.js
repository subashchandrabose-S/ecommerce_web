// API Configuration
// Supports: Development (localhost), Vercel (same domain), Render (external URL)

const getApiUrl = () => {
    // Check for explicit API URL (for Render or other external deployments)
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL
    }
    // In production without explicit URL (Vercel - same domain)
    if (import.meta.env.PROD) {
        return '/api'
    }
    // In development, use localhost backend
    return 'http://localhost:5000/api'
}

export const API_BASE_URL = getApiUrl()

