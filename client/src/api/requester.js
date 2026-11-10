const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030'

function getToken() {
  try {
    return JSON.parse(localStorage.getItem('auth'))?.accessToken
  } catch {
    return undefined
  }
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