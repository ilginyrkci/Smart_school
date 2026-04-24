import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Her istekte token'ı otomatik ekle
API.interceptors.request.use(config => {
  const token = localStorage.getItem('finans_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 401 gelirse oturumu kapat ve giriş sayfasına yönlendir
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('finans_token')
      localStorage.removeItem('finans_user')
      // Giriş sayfasına yönlendir
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      } else {
        window.location.reload()
      }
    }
    return Promise.reject(err)
  }
)

export const transactionService = {
  getAll:  (params = {}) => API.get('/transactions', { params }),
  create:  (data)        => API.post('/transactions', data),
  update:  (id, data)    => API.put(`/transactions/${id}`, data),
  delete:  (id)          => API.delete(`/transactions/${id}`),
}

export const budgetService = {
  get:    ()      => API.get('/budget'),
  update: (limit) => API.put('/budget', { monthlyLimit: limit }),
}

export const coachService = {
  getAdvice: () => API.get('/coach/advice'),
}

export const reportService = {
  getSummary:      () => API.get('/report/summary'),
  getCategories:   () => API.get('/report/categories'),
  getMonthlyTrend: () => API.get('/report/monthly-trend'),
}

export const authService = {
  login:              (username, password)                   => API.post('/auth/login', { username, password }),
  register:           (username, password, displayName, email) => API.post('/auth/register', { username, password, displayName, email }),
  getProfile:         ()                                     => API.get('/auth/me'),
  updateProfile:      (data)                                 => API.put('/auth/profile', data),
  changePassword:     (oldPassword, newPassword)             => API.put('/auth/password', { oldPassword, newPassword }),
  logout:             ()                                     => API.post('/auth/logout'),
  changeUsername:     (newUsername)                          => API.put('/auth/username', { newUsername }),
  getUsernameStatus:  ()                                     => API.get('/auth/username-status'),
}
