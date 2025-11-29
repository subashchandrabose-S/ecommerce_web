// API Configuration
// In development: uses localhost
// In production: uses relative URLs (same domain as frontend)

const getApiUrl = () => {
    // Check if we're in production (Vercel) or development
    if (import.meta.env.PROD) {
        // In production, API runs on the same domain
        return '/api'
    }
    // In development, use localhost backend
    return 'http://localhost:5000/api'
}

export const API_BASE_URL = getApiUrl()
