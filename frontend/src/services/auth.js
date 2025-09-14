import api from './api.js'; // Importez votre instance

export async function authFetch(url, options = {}) {
    const token = localStorage.getItem('access');
    
    try {
        // Utilisez votre instance api au lieu de fetch
        const response = await api({
            url: url,
            method: options.method || 'GET',
            data: options.body ? JSON.parse(options.body) : undefined,
            headers: {
                ...options.headers,
                Authorization: token ? `Bearer ${token}` : '',
            }
        });
        
        return {
            ok: true,
            status: response.status,
            json: async () => response.data,
            headers: {
                get: (name) => response.headers[name.toLowerCase()]
            }
        };
        
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login?expired=1';
            return;
        }
        throw error;
    }
}