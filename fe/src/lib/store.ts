import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Memo {
  id: string
  title: string
  content: string
  folderId: string | null
  tags: string[]
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export interface Folder {
  id: string
  name: string
  parentId: string | null
  color?: string
}

type StorageType = 'local' | 'cloud'

interface MemoStore {
  // Storage type
  storageType: StorageType
  
  // Local storage data
  localMemos: Memo[]
  localFolders: Folder[]
  localTags: string[]
  
  // Cloud storage data
  cloudMemos: Memo[]
  cloudFolders: Folder[]
  cloudTags: string[]
  
  // UI state
  currentMemo: Memo | null
  searchQuery: string
  selectedFolder: string | null
  selectedTag: string | null
  
  // Computed getters
  getMemos: () => Memo[]
  getFolders: () => Folder[]
  getTags: () => string[]
  
  // Storage type actions
  setStorageType: (type: StorageType) => void
  
  // Memo actions (storage type에 따라 분기)
  setMemos: (memos: Memo[]) => void
  addMemo: (memo: Memo) => void
  updateMemo: (id: string, updates: Partial<Memo>) => void
  deleteMemo: (id: string) => void
  setCurrentMemo: (memo: Memo | null) => void
  
  // Local memo actions
  setLocalMemos: (memos: Memo[]) => void
  addLocalMemo: (memo: Memo) => void
  updateLocalMemo: (id: string, updates: Partial<Memo>) => void
  deleteLocalMemo: (id: string) => void
  
  // Cloud memo actions
  setCloudMemos: (memos: Memo[]) => void
  addCloudMemo: (memo: Memo) => void
  updateCloudMemo: (id: string, updates: Partial<Memo>) => void
  deleteCloudMemo: (id: string) => void
  
  // Folder actions (storage type에 따라 분기)
  setFolders: (folders: Folder[]) => void
  addFolder: (folder: Folder) => void
  updateFolder: (id: string, updates: Partial<Folder>) => void
  deleteFolder: (id: string) => void
  breakFolder: (folderId: string) => { memoCount: number; folderCount: number }
  burnFolder: (folderId: string) => { memoCount: number; folderCount: number }
  burnMemo: (memoId: string) => void
  
  // Local folder actions
  setLocalFolders: (folders: Folder[]) => void
  addLocalFolder: (folder: Folder) => void
  updateLocalFolder: (id: string, updates: Partial<Folder>) => void
  deleteLocalFolder: (id: string) => void
  
  // Cloud folder actions
  setCloudFolders: (folders: Folder[]) => void
  addCloudFolder: (folder: Folder) => void
  updateCloudFolder: (id: string, updates: Partial<Folder>) => void
  deleteCloudFolder: (id: string) => void
  
  // Tag actions (storage type에 따라 분기)
  setTags: (tags: string[]) => void
  addTag: (tag: string) => void
  
  // Local tag actions
  setLocalTags: (tags: string[]) => void
  addLocalTag: (tag: string) => void
  
  // Cloud tag actions
  setCloudTags: (tags: string[]) => void
  addCloudTag: (tag: string) => void
  
  // Filter actions
  setSearchQuery: (query: string) => void
  setSelectedFolder: (folderId: string | null) => void
  setSelectedTag: (tag: string | null) => void
}

export const useMemoStore = create<MemoStore>()(
  devtools(
    persist(
      (set, get) => ({
        storageType: 'local',
        
        // Local storage data
        localMemos: [],
        localFolders: [],
        localTags: [],
        
        // Cloud storage data
        cloudMemos: [],
        cloudFolders: [],
        cloudTags: [],
        
        // UI state
        currentMemo: null,
        searchQuery: '',
        selectedFolder: null,
        selectedTag: null,
        
        // Computed getters
        getMemos: () => {
          const { storageType, localMemos, cloudMemos } = get()
          return storageType === 'local' ? localMemos : cloudMemos
        },
        
        getFolders: () => {
          const { storageType, localFolders, cloudFolders } = get()
          return storageType === 'local' ? localFolders : cloudFolders
        },
        
        getTags: () => {
          const { storageType, localTags, cloudTags } = get()
          return storageType === 'local' ? localTags : cloudTags
        },
        
        // Storage type actions
        setStorageType: (type) => set({ storageType: type }),
        
        // Memo actions (storage type에 따라 분기)
        setMemos: (memos) => {
          const { storageType } = get()
          if (storageType === 'local') {
            set({ localMemos: memos })
          } else {
            set({ cloudMemos: memos })
          }
        },
        
        addMemo: (memo) => {
          const { storageType, localMemos, cloudMemos } = get()
          if (storageType === 'local') {
            set({ localMemos: [memo, ...localMemos] })
          } else {
            set({ cloudMemos: [memo, ...cloudMemos] })
          }
        },
        
        updateMemo: (id, updates) => {
          const { storageType, localMemos, cloudMemos } = get()
          if (storageType === 'local') {
            set({
              localMemos: localMemos.map((memo) =>
                memo.id === id ? { ...memo, ...updates } : memo
              ),
            })
          } else {
            set({
              cloudMemos: cloudMemos.map((memo) =>
                memo.id === id ? { ...memo, ...updates } : memo
              ),
            })
          }
        },
        
        deleteMemo: (id) => {
          const { storageType, localMemos, cloudMemos } = get()
          if (storageType === 'local') {
            set({ localMemos: localMemos.filter((memo) => memo.id !== id) })
          } else {
            set({ cloudMemos: cloudMemos.filter((memo) => memo.id !== id) })
          }
        },
        
        setCurrentMemo: (memo) => set({ currentMemo: memo }),
        
        // Local memo actions
        setLocalMemos: (memos) => set({ localMemos: memos }),
        addLocalMemo: (memo) => set((state) => ({ localMemos: [memo, ...state.localMemos] })),
        updateLocalMemo: (id, updates) =>
          set((state) => ({
            localMemos: state.localMemos.map((memo) =>
              memo.id === id ? { ...memo, ...updates } : memo
            ),
          })),
        deleteLocalMemo: (id) =>
          set((state) => ({
            localMemos: state.localMemos.filter((memo) => memo.id !== id),
          })),
        
        // Cloud memo actions
        setCloudMemos: (memos) => set({ cloudMemos: memos }),
        addCloudMemo: (memo) => set((state) => ({ cloudMemos: [memo, ...state.cloudMemos] })),
        updateCloudMemo: (id, updates) =>
          set((state) => ({
            cloudMemos: state.cloudMemos.map((memo) =>
              memo.id === id ? { ...memo, ...updates } : memo
            ),
          })),
        deleteCloudMemo: (id) =>
          set((state) => ({
            cloudMemos: state.cloudMemos.filter((memo) => memo.id !== id),
          })),
        
        // Folder actions (storage type에 따라 분기)
        setFolders: (folders) => {
          const { storageType } = get()
          if (storageType === 'local') {
            set({ localFolders: folders })
          } else {
            set({ cloudFolders: folders })
          }
        },
        
        addFolder: (folder) => {
          const { storageType, localFolders, cloudFolders } = get()
          if (storageType === 'local') {
            set({ localFolders: [...localFolders, folder] })
          } else {
            set({ cloudFolders: [...cloudFolders, folder] })
          }
        },
        
        updateFolder: (id, updates) => {
          const { storageType, localFolders, cloudFolders } = get()
          if (storageType === 'local') {
            set({
              localFolders: localFolders.map((folder) =>
                folder.id === id ? { ...folder, ...updates } : folder
              ),
            })
          } else {
            set({
              cloudFolders: cloudFolders.map((folder) =>
                folder.id === id ? { ...folder, ...updates } : folder
              ),
            })
          }
        },
        
        deleteFolder: (id) => {
          const { storageType, localFolders, cloudFolders } = get()
          if (storageType === 'local') {
            set({ localFolders: localFolders.filter((folder) => folder.id !== id) })
          } else {
            set({ cloudFolders: cloudFolders.filter((folder) => folder.id !== id) })
          }
        },
        
        // Local folder actions
        setLocalFolders: (folders) => set({ localFolders: folders }),
        addLocalFolder: (folder) => set((state) => ({ localFolders: [...state.localFolders, folder] })),
        updateLocalFolder: (id, updates) =>
          set((state) => ({
            localFolders: state.localFolders.map((folder) =>
              folder.id === id ? { ...folder, ...updates } : folder
            ),
          })),
        deleteLocalFolder: (id) =>
          set((state) => ({
            localFolders: state.localFolders.filter((folder) => folder.id !== id),
          })),
        
        // Cloud folder actions
        setCloudFolders: (folders) => set({ cloudFolders: folders }),
        addCloudFolder: (folder) => set((state) => ({ cloudFolders: [...state.cloudFolders, folder] })),
        updateCloudFolder: (id, updates) =>
          set((state) => ({
            cloudFolders: state.cloudFolders.map((folder) =>
              folder.id === id ? { ...folder, ...updates } : folder
            ),
          })),
        deleteCloudFolder: (id) =>
          set((state) => ({
            cloudFolders: state.cloudFolders.filter((folder) => folder.id !== id),
          })),
        
        // Tag actions (storage type에 따라 분기)
        setTags: (tags) => {
          const { storageType } = get()
          if (storageType === 'local') {
            set({ localTags: tags })
          } else {
            set({ cloudTags: tags })
          }
        },
        
        addTag: (tag) => {
          const { storageType, localTags, cloudTags } = get()
          if (storageType === 'local') {
            set({ localTags: [...new Set([...localTags, tag])] })
          } else {
            set({ cloudTags: [...new Set([...cloudTags, tag])] })
          }
        },
        
        // Local tag actions
        setLocalTags: (tags) => set({ localTags: tags }),
        addLocalTag: (tag) =>
          set((state) => ({ localTags: [...new Set([...state.localTags, tag])] })),
        
        // Cloud tag actions
        setCloudTags: (tags) => set({ cloudTags: tags }),
        addCloudTag: (tag) =>
          set((state) => ({ cloudTags: [...new Set([...state.cloudTags, tag])] })),
        
        // Filter actions
        setSearchQuery: (query) => set({ searchQuery: query }),
        setSelectedFolder: (folderId) => set({ selectedFolder: folderId }),
        setSelectedTag: (tag) => set({ selectedTag: tag }),
        
        // 폴더 깨기 (메모와 하위 폴더를 상위로 이동)
        breakFolder: (folderId) => {
          const { storageType, localMemos, cloudMemos, localFolders, cloudFolders } = get()
          const memos = storageType === 'local' ? localMemos : cloudMemos
          const folders = storageType === 'local' ? localFolders : cloudFolders
          
          const targetFolder = folders.find(f => f.id === folderId)
          if (!targetFolder) return { memoCount: 0, folderCount: 0 }
          
          const affectedMemos = memos.filter(m => m.folderId === folderId)
          const affectedFolders = folders.filter(f => f.parentId === folderId)
          
          const updatedMemos = memos.map(m => 
            m.folderId === folderId ? { ...m, folderId: targetFolder.parentId } : m
          )
          
          const updatedFolders = folders
            .filter(f => f.id !== folderId)
            .map(f => f.parentId === folderId ? { ...f, parentId: targetFolder.parentId } : f)
          
          if (storageType === 'local') {
            set({ localMemos: updatedMemos, localFolders: updatedFolders })
          } else {
            set({ cloudMemos: updatedMemos, cloudFolders: updatedFolders })
          }
          
          return { memoCount: affectedMemos.length, folderCount: affectedFolders.length }
        },
        
        // 폴더 태우기 (폴더와 모든 내용 삭제)
        burnFolder: (folderId) => {
          const { storageType, localMemos, cloudMemos, localFolders, cloudFolders } = get()
          const memos = storageType === 'local' ? localMemos : cloudMemos
          const folders = storageType === 'local' ? localFolders : cloudFolders
          
          const getAllDescendantFolders = (parentId: string): string[] => {
            const children = folders.filter(f => f.parentId === parentId)
            const descendantIds = children.map(c => c.id)
            children.forEach(child => {
              descendantIds.push(...getAllDescendantFolders(child.id))
            })
            return descendantIds
          }
          
          const folderIdsToDelete = [folderId, ...getAllDescendantFolders(folderId)]
          const affectedMemos = memos.filter(m => m.folderId && folderIdsToDelete.includes(m.folderId))
          
          const updatedMemos = memos.filter(m => !m.folderId || !folderIdsToDelete.includes(m.folderId))
          const updatedFolders = folders.filter(f => !folderIdsToDelete.includes(f.id))
          
          if (storageType === 'local') {
            set({ localMemos: updatedMemos, localFolders: updatedFolders })
          } else {
            set({ cloudMemos: updatedMemos, cloudFolders: updatedFolders })
          }
          
          return { memoCount: affectedMemos.length, folderCount: folderIdsToDelete.length - 1 }
        },
        
        // 메모 태우기 (메모 삭제)
        burnMemo: (memoId) => {
          const { storageType, localMemos, cloudMemos } = get()
          if (storageType === 'local') {
            set({ localMemos: localMemos.filter(m => m.id !== memoId) })
          } else {
            set({ cloudMemos: cloudMemos.filter(m => m.id !== memoId) })
          }
        },
      }),
      {
        name: 'memo-store',
        partialize: (state) => ({
          storageType: state.storageType,
          localMemos: state.localMemos,
          localFolders: state.localFolders,
          localTags: state.localTags,
        }),
      }
    )
  )
)
