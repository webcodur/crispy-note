'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { foldersApi, type CreateFolderDto, type UpdateFolderDto } from '../api'
import toast from 'react-hot-toast'

export const useFolders = () => {
  return useQuery({
    queryKey: ['folders'],
    queryFn: () => foldersApi.getAll(),
  })
}

export const useFolderTree = () => {
  return useQuery({
    queryKey: ['folders', 'tree'],
    queryFn: () => foldersApi.getTree(),
  })
}

export const useCreateFolder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFolderDto) => foldersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      toast.success('폴더가 생성되었습니다')
    },
    onError: () => {
      toast.error('폴더 생성에 실패했습니다')
    },
  })
}

export const useUpdateFolder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFolderDto }) =>
      foldersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      toast.success('폴더가 수정되었습니다')
    },
    onError: () => {
      toast.error('폴더 수정에 실패했습니다')
    },
  })
}

export const useDeleteFolder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => foldersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      toast.success('폴더가 삭제되었습니다')
    },
    onError: () => {
      toast.error('폴더 삭제에 실패했습니다')
    },
  })
}

