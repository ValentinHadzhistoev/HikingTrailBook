import { get, post } from './requester'

export const register = (email, password) => post('/users/register', { email, password })
export const login = (email, password) => post('/users/login', { email, password })
export const logout = () => get('/users/logout')