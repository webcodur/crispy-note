'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tagsApi, type CreateTagDto, type UpdateTagDto } from '../api'
import toast from 'react-hot-toast'

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.getAll(),
  })
}

export const useCreateTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTagDto) => tagsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('태그가 생성되었습니다')
    },
    onError: () => {
      toast.error('태그 생성에 실패했습니다')
    },
  })
}

export const useUpdateTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTagDto }) =>
      tagsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('태그가 수정되었습니다')
    },
    onError: () => {
      toast.error('태그 수정에 실패했습니다')
    },
  })
}

export const useDeleteTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tagsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('태그가 삭제되었습니다')
    },
    onError: () => {
      toast.error('태그 삭제에 실패했습니다')
    },
  })
}

