import apiClient from '../api-client'

export interface Tag {
  id: string
  name: string
  color?: string
  userId: string
  createdAt: string
}

export interface CreateTagDto {
  name: string
  color?: string
}

export interface UpdateTagDto {
  name?: string
  color?: string
}

export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    const response = await apiClient.get('/tags')
    return response.data
  },

  getOne: async (id: string): Promise<Tag> => {
    const response = await apiClient.get(`/tags/${id}`)
    return response.data
  },

  create: async (data: CreateTagDto): Promise<Tag> => {
    const response = await apiClient.post('/tags', data)
    return response.data
  },

  update: async (id: string, data: UpdateTagDto): Promise<Tag> => {
    const response = await apiClient.put(`/tags/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tags/${id}`)
  },
}

