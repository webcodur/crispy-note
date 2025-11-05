import apiClient from '../api-client'

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterData extends AuthCredentials {
  nickname?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken?: string
  user: {
    id: string
    email: string
    nickname: string
    avatar?: string
  }
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  getProfile: async () => {
    const response = await apiClient.get('/users/me')
    return response.data
  },

  updateProfile: async (data: any) => {
    const response = await apiClient.put('/users/me', data)
    return response.data
  },
}

