// API Configuration
// In development: uses localhost
// In production: uses relative URLs (same domain as frontend)

const getApiUrl = () => {
    return '/api'
}

export const API_BASE_URL = getApiUrl()
