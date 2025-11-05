import apiClient from '../api-client'

export interface Memo {
  id: string
  title: string
  content: string
  folderId: string | null
  tags: Tag[]
  isPinned: boolean
  isDeleted: boolean
  deletedAt: Date | null
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  name: string
  color?: string
}

export interface CreateMemoDto {
  title?: string
  content: string
  folderId?: string
  tags?: string[]
  isPinned?: boolean
}

export interface UpdateMemoDto {
  title?: string
  content?: string
  folderId?: string
  tags?: string[]
  isPinned?: boolean
}

export interface MemoQueryParams {
  search?: string
  folderId?: string
  tagId?: string
  isPinned?: boolean
  isDeleted?: boolean
  sortBy?: 'createdAt' | 'updatedAt' | 'title'
  order?: 'ASC' | 'DESC'
}

export const memosApi = {
  getAll: async (params?: MemoQueryParams): Promise<Memo[]> => {
    const response = await apiClient.get('/memos', { params })
    return response.data
  },

  getOne: async (id: string): Promise<Memo> => {
    const response = await apiClient.get(`/memos/${id}`)
    return response.data
  },

  create: async (data: CreateMemoDto): Promise<Memo> => {
    const response = await apiClient.post('/memos', data)
    return response.data
  },

  update: async (id: string, data: UpdateMemoDto): Promise<Memo> => {
    const response = await apiClient.put(`/memos/${id}`, data)
    return response.data
  },

  togglePin: async (id: string): Promise<Memo> => {
    const response = await apiClient.put(`/memos/${id}/pin`)
    return response.data
  },

  delete: async (id: string): Promise<Memo> => {
    const response = await apiClient.delete(`/memos/${id}`)
    return response.data
  },

  restore: async (id: string): Promise<Memo> => {
    const response = await apiClient.put(`/memos/${id}/restore`)
    return response.data
  },

  permanentDelete: async (id: string): Promise<void> => {
    await apiClient.delete(`/memos/${id}/permanent`)
  },
}

