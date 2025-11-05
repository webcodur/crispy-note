import { supabase } from '@/lib/supabase'

export interface CloudMemo {
  id: string
  title: string
  content: string
  folder_id: string | null
  tags: string[]
  is_pinned: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export interface CloudFolder {
  id: string
  name: string
  parent_id: string | null
  color?: string
  user_id: string
}

export interface CreateCloudMemoDto {
  title?: string
  content: string
  folder_id?: string | null
  tags?: string[]
  is_pinned?: boolean
}

export interface UpdateCloudMemoDto {
  title?: string
  content?: string
  folder_id?: string | null
  tags?: string[]
  is_pinned?: boolean
}

export const cloudStorageApi = {
  // Memo operations
  getAllMemos: async (): Promise<CloudMemo[]> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  getMemo: async (id: string): Promise<CloudMemo> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return data
  },

  createMemo: async (dto: CreateCloudMemoDto): Promise<CloudMemo> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('memos')
      .insert({
        ...dto,
        user_id: user.id,
        title: dto.title || '',
        tags: dto.tags || [],
        is_pinned: dto.is_pinned || false,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  updateMemo: async (
    id: string,
    dto: UpdateCloudMemoDto
  ): Promise<CloudMemo> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('memos')
      .update({
        ...dto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  deleteMemo: async (id: string): Promise<void> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('memos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },

  // Folder operations
  getAllFolders: async (): Promise<CloudFolder[]> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  },

  createFolder: async (name: string, color?: string): Promise<CloudFolder> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('folders')
      .insert({
        name,
        color,
        user_id: user.id,
        parent_id: null,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  updateFolder: async (
    id: string,
    updates: Partial<CloudFolder>
  ): Promise<CloudFolder> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('folders')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  deleteFolder: async (id: string): Promise<void> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },
}

// Helper function to convert CloudMemo to local Memo format
export function cloudMemoToLocal(cloudMemo: CloudMemo) {
  return {
    id: cloudMemo.id,
    title: cloudMemo.title,
    content: cloudMemo.content,
    folderId: cloudMemo.folder_id,
    tags: cloudMemo.tags,
    isFavorite: cloudMemo.is_favorite,
    createdAt: cloudMemo.created_at,
    updatedAt: cloudMemo.updated_at,
  }
}

// Helper function to convert local Memo to CloudMemo format
export function localMemoToCloud(localMemo: {
  id: string
  title: string
  content: string
  folderId: string | null
  tags: string[]
  isFavorite: boolean
}) {
  return {
    title: localMemo.title,
    content: localMemo.content,
    folder_id: localMemo.folderId,
    tags: localMemo.tags,
    is_favorite: localMemo.isFavorite,
  }
}

