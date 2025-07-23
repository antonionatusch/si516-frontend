import axios from 'axios'

// Base URL for the API
const API_BASE_URL = 'http://localhost:8080'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      logout()
      window.location.href = '/#/login'
    }
    return Promise.reject(error)
  }
)

// Auth helper functions
export const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

export const getDoctorInfo = () => {
  const doctorInfo = localStorage.getItem('doctorInfo')
  return doctorInfo ? JSON.parse(doctorInfo) : null
}

export const isAuthenticated = () => {
  return !!getAuthToken()
}

export const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('doctorInfo')
}

// Auth API functions
export const authAPI = {
  register: (doctorData) => {
    return axios.post(`${API_BASE_URL}/auth/register`, doctorData)
  },
  
  login: (credentials) => {
    return axios.post(`${API_BASE_URL}/auth/login`, credentials)
  },
}

// Export configured axios instance for other API calls
export default api