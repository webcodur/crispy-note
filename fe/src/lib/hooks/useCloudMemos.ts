'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  cloudStorageApi,
  cloudMemoToLocal,
  localMemoToCloud,
  type CloudMemo,
  type CreateCloudMemoDto,
  type UpdateCloudMemoDto,
} from '@/lib/api/cloud-storage'
import { useMemoStore } from '@/lib/store'
import toast from 'react-hot-toast'

export function useCloudMemos() {
  const queryClient = useQueryClient()
  const {
    setCloudMemos,
    addCloudMemo,
    updateCloudMemo,
    deleteCloudMemo,
  } = useMemoStore()

  // Fetch all memos
  const { data: memos, isLoading } = useQuery({
    queryKey: ['cloudMemos'],
    queryFn: async () => {
      const cloudMemos = await cloudStorageApi.getAllMemos()
      const localMemos = cloudMemos.map(cloudMemoToLocal)
      setCloudMemos(localMemos)
      return localMemos
    },
    enabled: true,
    retry: 1,
  })

  // Create memo
  const createMutation = useMutation({
    mutationFn: async (dto: CreateCloudMemoDto) => {
      const cloudMemo = await cloudStorageApi.createMemo(dto)
      return cloudMemoToLocal(cloudMemo)
    },
    onSuccess: (localMemo) => {
      addCloudMemo(localMemo)
      queryClient.invalidateQueries({ queryKey: ['cloudMemos'] })
      toast.success('메모가 생성되었습니다')
    },
    onError: (error: any) => {
      toast.error(error.message || '메모 생성에 실패했습니다')
    },
  })

  // Update memo
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string
      updates: UpdateCloudMemoDto
    }) => {
      const cloudMemo = await cloudStorageApi.updateMemo(id, updates)
      return cloudMemoToLocal(cloudMemo)
    },
    onSuccess: (localMemo) => {
      updateCloudMemo(localMemo.id, localMemo)
      queryClient.invalidateQueries({ queryKey: ['cloudMemos'] })
    },
    onError: (error: any) => {
      toast.error(error.message || '메모 업데이트에 실패했습니다')
    },
  })

  // Delete memo
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await cloudStorageApi.deleteMemo(id)
    },
    onSuccess: (_, id) => {
      deleteCloudMemo(id)
      queryClient.invalidateQueries({ queryKey: ['cloudMemos'] })
      toast.success('메모가 삭제되었습니다')
    },
    onError: (error: any) => {
      toast.error(error.message || '메모 삭제에 실패했습니다')
    },
  })

  return {
    memos: memos || [],
    isLoading,
    createMemo: createMutation.mutate,
    updateMemo: updateMutation.mutate,
    deleteMemo: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

