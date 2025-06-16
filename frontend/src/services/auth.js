export async function authFetch(url, options = {}) {
    const token = localStorage.getItem('access')

    const headers = {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
    }

    const res = await fetch(url, { ...options, headers })

    if (res.status === 401) {
        localStorage.clear()
        window.location.href = '/login?expired=1'
        return
    }

    return res
}
