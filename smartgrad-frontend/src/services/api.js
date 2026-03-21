/**
 * SmartGrad AI - API Service
 * Centralizes all backend calls.
 */
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: BASE_URL })

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sg_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const predictFull = (studentData) =>
  api.post('/predict/full', studentData).then((r) => r.data)

export const predictPlacement = (studentData) =>
  api.post('/predict/placement', studentData).then((r) => r.data)

export const predictGraduation = (studentData) =>
  api.post('/predict/graduation', studentData).then((r) => r.data)

export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password }).then((r) => r.data)

export const login = (email, password) => {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  return api.post('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }).then((r) => r.data)
}

export const getMe = () => api.get('/auth/me').then((r) => r.data)

export default api
