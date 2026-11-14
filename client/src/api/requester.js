const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030'

export const AUTH_EXPIRED_EVENT = 'auth:expired'

function getToken() {
  try {
    return JSON.parse(localStorage.getItem('auth'))?.accessToken
  } catch {
    return undefined
  }
}

function expireSession() {
  localStorage.removeItem('auth')
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
}

async function request(method, path, data) {
  const options = { method, headers: {} }

  const token = getToken()
  if (token) {
    options.headers['X-Authorization'] = token
  }

  if (data) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(data)
  }

  const response = await fetch(`${BASE_URL}${path}`, options)

  // Reads are public, so a 403 on a GET means the saved token is no longer valid.
  // Drop the session and repeat the request without a token.
  if (response.status === 403 && token && method === 'GET') {
    expireSession()
    return request(method, path, data)
  }

  if (response.status === 204) {
    return {}
  }

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(result.message || 'Request failed')
  }

  return result
}

export const get = (path) => request('GET', path)
export const post = (path, data) => request('POST', path, data)
export const put = (path, data) => request('PUT', path, data)
export const del = (path) => request('DELETE', path)