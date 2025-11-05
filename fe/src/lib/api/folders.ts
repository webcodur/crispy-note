import apiClient from '../api-client'

export interface Folder {
  id: string
  name: string
  color?: string
  parentId?: string
  userId: string
  children?: Folder[]
  createdAt: string
  updatedAt: string
}

export interface CreateFolderDto {
  name: string
  color?: string
  parentId?: string
}

export interface UpdateFolderDto {
  name?: string
  color?: string
  parentId?: string | null
}

export const foldersApi = {
  getAll: async (): Promise<Folder[]> => {
    const response = await apiClient.get('/folders')
    return response.data
  },

  getTree: async (): Promise<Folder[]> => {
    const response = await apiClient.get('/folders/tree')
    return response.data
  },

  getOne: async (id: string): Promise<Folder> => {
    const response = await apiClient.get(`/folders/${id}`)
    return response.data
  },

  create: async (data: CreateFolderDto): Promise<Folder> => {
    const response = await apiClient.post('/folders', data)
    return response.data
  },

  update: async (id: string, data: UpdateFolderDto): Promise<Folder> => {
    const response = await apiClient.put(`/folders/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/folders/${id}`)
  },
}

