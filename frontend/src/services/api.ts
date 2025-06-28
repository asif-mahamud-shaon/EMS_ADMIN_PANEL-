import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void; }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const clearAuthData = () => {
  Cookies.remove('accessToken', { path: '/' });
  Cookies.remove('refreshToken', { path: '/' });
  Cookies.remove('userData', { path: '/' });
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is unauthorized and we haven't tried refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (err) {
          clearAuthData();
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await api.post('/auth/refresh-token', { refreshToken });
        const { accessToken } = response.data as { accessToken: string };
        
        Cookies.set('accessToken', accessToken, { 
          expires: 1/96, // 15 minutes
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthData();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // If error is forbidden (403)
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    }

    return Promise.reject(error);
  }
);

// API Service Functions

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats')
};

// Departments API
export const departmentsApi = {
  getAll: () => api.get('/departments'),
  getById: (id: number) => api.get(`/departments/${id}`),
  create: (data: any) => api.post('/departments', data),
  update: (id: number, data: any) => api.put(`/departments/${id}`, data),
  delete: (id: number) => api.delete(`/departments/${id}`)
};

// Employees API
export const employeesApi = {
  getAll: () => api.get('/employees'),
  getById: (id: number) => api.get(`/employees/${id}`),
  create: (data: any) => api.post('/employees', data),
  update: (id: number, data: any) => api.put(`/employees/${id}`, data),
  delete: (id: number) => api.delete(`/employees/${id}`)
};

// Designations API
export const designationsApi = {
  getAll: () => api.get('/designations'),
  getById: (id: number) => api.get(`/designations/${id}`),
  create: (data: any) => api.post('/designations', data),
  update: (id: number, data: any) => api.put(`/designations/${id}`, data),
  delete: (id: number) => api.delete(`/designations/${id}`)
};

// Attendance API
export const attendanceApi = {
  getAll: (params?: any) => api.get('/attendance', { params }),
  getStats: (params?: any) => api.get('/attendance/stats', { params }),
  create: (data: any) => api.post('/attendance', data),
  update: (id: number, data: any) => api.put(`/attendance/${id}`, data)
};

// Leaves API
export const leavesApi = {
  getAll: (params?: any) => api.get('/leaves', { params }),
  getStats: (params?: any) => api.get('/leaves/stats', { params }),
  create: (data: any) => api.post('/leaves', data),
  updateStatus: (id: number, status: string) => api.put(`/leaves/${id}/status`, { status })
};

// Payroll API
export const payrollApi = {
  getAll: (params: { year: number; month: number }) => api.get('/payroll', { params }),
  getStats: (params?: { year: number; month: number }) => api.get('/payroll/stats', { params }),
  generate: (data: any) => api.post('/payroll/generate', data),
  update: (id: number, data: any) => api.put(`/payroll/${id}`, data),
  downloadPayslip: (id: number) => api.get(`/payroll/${id}/download`, { responseType: 'blob' })
};

export default api;