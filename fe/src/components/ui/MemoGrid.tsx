'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MemoCard } from './MemoCard'
import { FolderCard } from './FolderCard'
import { useMemoStore, type Memo, type Folder } from '@/lib/store'
import { FiFolder } from 'react-icons/fi'

interface MemoGridProps {
  onMemoClick: (memoId: string) => void
  onNewMemo?: () => void
  onNewFolder?: () => void
  onFolderClick?: (folderId: string) => void
  onBreakFolder?: (folderId: string) => void
  onPressStart?: (itemId: string) => void
  onPressEnd?: () => void
  onPressCancel?: () => void
  memos?: Memo[]
  folders?: Folder[]
  pinModeActive?: boolean
  hammerModeActive?: boolean
  lighterModeActive?: boolean
  burningItemId?: string | null
  pressingItemId?: string | null
  pressProgress?: number
  setPressProgress?: (progress: number) => void
  folderCracks?: Record<string, number>
}

export function MemoGrid({
  onMemoClick,
  onNewMemo,
  onNewFolder,
  onFolderClick,
  onBreakFolder,
  onPressStart,
  onPressEnd,
  onPressCancel,
  memos: providedMemos,
  folders: providedFolders,
  pinModeActive = false,
  hammerModeActive = false,
  lighterModeActive = false,
  burningItemId = null,
  pressingItemId = null,
  pressProgress = 0,
  setPressProgress,
  folderCracks = {},
}: MemoGridProps) {
  const { getMemos, deleteMemo, updateMemo, getFolders, deleteFolder, updateFolder } = useMemoStore()
  const storeMemos = getMemos()
  const storeFolders = getFolders()
  const memos = providedMemos ?? storeMemos
  const folders = providedFolders ?? storeFolders

  const sortedMemos = [...memos].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  const handleDelete = (id: string) => {
    deleteMemo(id)
  }

  const handleTogglePin = (id: string, isPinned: boolean) => {
    updateMemo(id, { isPinned: !isPinned })
  }

  const handleDeleteFolder = (id: string) => {
    deleteFolder(id)
  }

  const handleRenameFolder = (id: string, newName: string) => {
    updateFolder(id, { name: newName })
  }

  const countMemosInFolder = (folderId: string) => {
    return memos.filter(m => m.folderId === folderId).length
  }

  const pinnedMemos = sortedMemos.filter(memo => memo.isPinned)
  const unpinnedMemos = sortedMemos.filter(memo => !memo.isPinned)

  if (memos.length === 0 && onNewMemo) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-6">📝</div>
        <h3 className="text-2xl font-bold text-secondary mb-2">
          첫 메모를 끄적여보세요
        </h3>
        <p className="text-secondary/70 mb-8">
          생각나는 대로 자유롭게 작성해보세요
        </p>
        <motion.button
          onClick={onNewMemo}
          className="px-8 py-4 bg-accent text-white rounded-xl hover:brightness-90 transition-all flex items-center gap-3 font-semibold text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl">+</span>
          새 메모 작성하기
        </motion.button>
      </div>
    )
  }

  return (
    <div>
      {/* 코르크보드 섹션 (pin된 메모가 있을 때만) */}
      {pinnedMemos.length > 0 && (
        <div className="corkboard-section">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📌</span>
            <h2 className="text-xl font-bold text-secondary">고정된 메모</h2>
            <span className="text-sm text-secondary/60">({pinnedMemos.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {pinnedMemos.map((memo) => (
                <MemoCard
                  key={memo.id}
                  id={memo.id}
                  title={memo.title}
                  content={memo.content}
                  isPinned={memo.isPinned}
                  tags={memo.tags}
                  updatedAt={memo.updatedAt}
                  onClick={() => {
                    if (!lighterModeActive) {
                      onMemoClick(memo.id)
                    }
                  }}
                  onDelete={() => handleDelete(memo.id)}
                  onTogglePin={() =>
                    handleTogglePin(memo.id, memo.isPinned)
                  }
                  onPressStart={() => onPressStart?.(memo.id)}
                  onPressEnd={() => onPressEnd?.()}
                  onPressCancel={() => onPressCancel?.()}
                  pinModeActive={pinModeActive}
                  lighterModeActive={lighterModeActive}
                  isBurning={burningItemId === memo.id}
                  isPressing={pressingItemId === memo.id}
                  pressProgress={pressProgress}
                  setPressProgress={setPressProgress}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 폴더 및 일반 메모 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {/* 폴더 카드 */}
                {folders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    id={folder.id}
                    name={folder.name}
                    color={folder.color}
                    memoCount={countMemosInFolder(folder.id)}
                    onClick={() => {
                      if (hammerModeActive) {
                        onBreakFolder?.(folder.id)
                      } else if (!lighterModeActive) {
                        onFolderClick?.(folder.id)
                      }
                    }}
                    onDelete={() => handleDeleteFolder(folder.id)}
                    onRename={(newName) => handleRenameFolder(folder.id, newName)}
                    onPressStart={() => onPressStart?.(folder.id)}
                    onPressEnd={() => onPressEnd?.()}
                    onPressCancel={() => onPressCancel?.()}
                    hammerModeActive={hammerModeActive}
                    lighterModeActive={lighterModeActive}
                    isBurning={burningItemId === folder.id}
                    isPressing={pressingItemId === folder.id}
                    pressProgress={pressProgress}
                    setPressProgress={setPressProgress}
                    crackLevel={folderCracks[folder.id] || 0}
                  />
                ))}
          
          {/* 메모 카드 */}
          {unpinnedMemos.map((memo) => (
            <MemoCard
              key={memo.id}
              id={memo.id}
              title={memo.title}
              content={memo.content}
              isPinned={memo.isPinned}
              tags={memo.tags}
              updatedAt={memo.updatedAt}
              onClick={() => {
                if (!lighterModeActive) {
                  onMemoClick(memo.id)
                }
              }}
              onDelete={() => handleDelete(memo.id)}
              onTogglePin={() =>
                handleTogglePin(memo.id, memo.isPinned)
              }
              onPressStart={() => onPressStart?.(memo.id)}
              onPressEnd={() => onPressEnd?.()}
              onPressCancel={() => onPressCancel?.()}
              pinModeActive={pinModeActive}
              lighterModeActive={lighterModeActive}
              isBurning={burningItemId === memo.id}
              isPressing={pressingItemId === memo.id}
              pressProgress={pressProgress}
              setPressProgress={setPressProgress}
            />
          ))}
          
          {/* 새 메모/폴더 버튼 */}
          {(onNewMemo || onNewFolder) && (
            <div className="aspect-[3/4] grid grid-rows-2 gap-2">
              {onNewMemo && (
                <motion.button
                  onClick={onNewMemo}
                  className="rounded-xl border-2 border-dashed border-secondary/20 hover:border-accent hover:bg-accent/5 transition-all flex flex-col items-center justify-center gap-2 group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                    <span className="text-2xl text-accent">+</span>
                  </div>
                  <span className="text-xs text-secondary/60 group-hover:text-accent font-medium transition-colors">
                    새 메모
                  </span>
                </motion.button>
              )}
              
              {onNewFolder && (
                <motion.button
                  onClick={onNewFolder}
                  className="rounded-xl border-2 border-dashed border-secondary/20 hover:border-accent hover:bg-accent/5 transition-all flex flex-col items-center justify-center gap-2 group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                    <FiFolder size={20} className="text-accent" />
                  </div>
                  <span className="text-xs text-secondary/60 group-hover:text-accent font-medium transition-colors">
                    새 폴더
                  </span>
                </motion.button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

