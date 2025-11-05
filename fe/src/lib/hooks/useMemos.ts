'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { memosApi, type MemoQueryParams, type CreateMemoDto, type UpdateMemoDto } from '../api'
import toast from 'react-hot-toast'

export const useMemos = (params?: MemoQueryParams) => {
  return useQuery({
    queryKey: ['memos', params],
    queryFn: () => memosApi.getAll(params),
  })
}

export const useMemo = (id: string) => {
  return useQuery({
    queryKey: ['memo', id],
    queryFn: () => memosApi.getOne(id),
    enabled: !!id,
  })
}

export const useCreateMemo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMemoDto) => memosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memos'] })
      toast.success('메모가 생성되었습니다')
    },
    onError: () => {
      toast.error('메모 생성에 실패했습니다')
    },
  })
}

export const useUpdateMemo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemoDto }) =>
      memosApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['memos'] })
      queryClient.invalidateQueries({ queryKey: ['memo', variables.id] })
    },
    onError: () => {
      toast.error('메모 수정에 실패했습니다')
    },
  })
}

export const useTogglePinMemo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => memosApi.togglePin(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['memos'] })
      queryClient.invalidateQueries({ queryKey: ['memo', data.id] })
      toast.success(
        data.isPinned ? '메모를 고정했습니다' : '메모 고정을 해제했습니다'
      )
    },
    onError: () => {
      toast.error('메모 고정 변경에 실패했습니다')
    },
  })
}

export const useDeleteMemo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => memosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memos'] })
      toast.success('메모를 구겨서 버렸어요 🗑️')
    },
    onError: () => {
      toast.error('메모 삭제에 실패했습니다')
    },
  })
}

export const useRestoreMemo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => memosApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memos'] })
      toast.success('메모를 복구했습니다')
    },
    onError: () => {
      toast.error('메모 복구에 실패했습니다')
    },
  })
}

export const usePermanentDeleteMemo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => memosApi.permanentDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memos'] })
      toast.success('메모를 영구 삭제했습니다')
    },
    onError: () => {
      toast.error('메모 영구 삭제에 실패했습니다')
    },
  })
}

