'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MemoGrid } from '@/components/ui/MemoGrid'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { useMemoStore } from '@/lib/store'
import { generateId, buildFolderPath, getFolderChildren, getMemosInFolder } from '@/lib/utils'
import toast from 'react-hot-toast'

export function DashboardView() {
  const router = useRouter()
  const { 
    addMemo, 
    addFolder, 
    getMemos, 
    getFolders, 
    selectedFolder, 
    setSelectedFolder,
    breakFolder,
    burnFolder,
    burnMemo,
  } = useMemoStore()
  const [pinModeActive, setPinModeActive] = useState(false)
  const [hammerModeActive, setHammerModeActive] = useState(false)
  const [hammerSwing, setHammerSwing] = useState(false)
  const [lighterModeActive, setLighterModeActive] = useState(false)
  const [burningItemId, setBurningItemId] = useState<string | null>(null)
  const [pressingItemId, setPressingItemId] = useState<string | null>(null)
  const [pressProgress, setPressProgress] = useState(0)
  const [folderCracks, setFolderCracks] = useState<Record<string, number>>({})
  
  const allMemos = getMemos()
  const allFolders = getFolders()

  const handleMemoClick = (memoId: string) => {
    router.push(`/dashboard/memos/${memoId}`)
  }

  const handleNewMemo = () => {
    const newMemoId = generateId()
    const newMemo = {
      id: newMemoId,
      title: '',
      content: '',
      folderId: selectedFolder,
      tags: [],
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addMemo(newMemo)
    router.push(`/dashboard/memos/${newMemoId}`)
  }

  const handleNewFolder = () => {
    const newFolderId = generateId()
    const newFolder = {
      id: newFolderId,
      name: '새 폴더',
      parentId: selectedFolder,
      color: '#6D5A43',
    }
    addFolder(newFolder)
  }

  const handleTogglePinMode = () => {
    const newState = !pinModeActive
    setPinModeActive(newState)
    if (newState) {
      setHammerModeActive(false)
      setLighterModeActive(false)
    }
  }

  const handleToggleHammerMode = () => {
    const newState = !hammerModeActive
    setHammerModeActive(newState)
    if (newState) {
      setPinModeActive(false)
      setLighterModeActive(false)
    }
  }

  const handleToggleLighterMode = () => {
    const newState = !lighterModeActive
    setLighterModeActive(newState)
    if (newState) {
      setPinModeActive(false)
      setHammerModeActive(false)
    }
  }

  const handleBreakFolder = (folderId: string) => {
    setHammerSwing(true)
    setTimeout(() => setHammerSwing(false), 300)
    
    const currentCracks = folderCracks[folderId] || 0
    
    if (currentCracks < 2) {
      setFolderCracks(prev => ({
        ...prev,
        [folderId]: currentCracks + 1
      }))
      toast(`금이 갔습니다! 🔨 (${currentCracks + 1}/3)`, {
        icon: '⚠️',
      })
    } else {
      const result = breakFolder(folderId)
      setFolderCracks(prev => {
        const newCracks = { ...prev }
        delete newCracks[folderId]
        return newCracks
      })
      toast.success(`폴더를 깼습니다! 🔨 메모 ${result.memoCount}개와 하위 폴더 ${result.folderCount}개가 나왔습니다`)
      setHammerModeActive(false)
    }
  }

  const handleBurnFolder = (folderId: string) => {
    setBurningItemId(folderId)
    setTimeout(() => {
      const result = burnFolder(folderId)
      toast.success(`🔥 폴더를 태웠습니다! 메모 ${result.memoCount}개와 폴더 ${result.folderCount}개가 삭제되었습니다`)
      setBurningItemId(null)
      setLighterModeActive(false)
    }, 800)
  }

  const handleBurnMemo = (memoId: string) => {
    setBurningItemId(memoId)
    setTimeout(() => {
      burnMemo(memoId)
      toast.success('🔥 메모를 태웠습니다')
      setBurningItemId(null)
      setLighterModeActive(false)
    }, 800)
  }

  const handlePressStart = (itemId: string) => {
    setPressingItemId(itemId)
    setPressProgress(0)
  }

  const handlePressEnd = () => {
    if (pressProgress >= 100) {
      if (pressingItemId) {
        const isFolder = allFolders.some(f => f.id === pressingItemId)
        if (isFolder) {
          handleBurnFolder(pressingItemId)
        } else {
          handleBurnMemo(pressingItemId)
        }
      }
    }
    setPressingItemId(null)
    setPressProgress(0)
  }

  const handlePressCancel = () => {
    setPressingItemId(null)
    setPressProgress(0)
  }

  const handleFolderClick = (folderId: string) => {
    setSelectedFolder(folderId)
  }

  const handleBreadcrumbNavigate = (folderId: string | null) => {
    setSelectedFolder(folderId)
  }

  const folderPath = useMemo(() => {
    return buildFolderPath(selectedFolder, allFolders)
  }, [selectedFolder, allFolders])

  const currentFolders = useMemo(() => {
    return getFolderChildren(selectedFolder, allFolders)
  }, [selectedFolder, allFolders])

  const currentMemos = useMemo(() => {
    return getMemosInFolder(selectedFolder, allMemos)
  }, [selectedFolder, allMemos])

  const cursorClass = pinModeActive ? 'cursor-pin' : hammerModeActive ? 'cursor-hammer' : lighterModeActive ? 'cursor-lighter' : ''
  const wrapperClass = `p-6 ${cursorClass} ${hammerSwing ? 'hammer-active' : ''}`

  return (
    <div className={wrapperClass}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            모든 메모
          </h1>
          <p className="text-secondary/70 mb-4">
            자유롭게 생각을 끄적여보세요
          </p>
          
          {/* Breadcrumb */}
          {folderPath.length > 0 && (
            <Breadcrumb 
              items={folderPath.map(f => ({ id: f.id, name: f.name }))} 
              onNavigate={handleBreadcrumbNavigate}
            />
          )}
          
          {/* Toolbox */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePinMode}
              className={`group relative px-4 py-2 rounded-lg border-2 transition-all ${
                pinModeActive
                  ? 'bg-accent text-white border-accent shadow-md'
                  : 'bg-white text-secondary border-secondary/20 hover:border-accent hover:bg-accent/5'
              }`}
              title="핀 모드"
            >
              <span className="text-xl">📌</span>
            </button>
            
            <button
              onClick={handleToggleHammerMode}
              className={`group relative px-4 py-2 rounded-lg border-2 transition-all ${
                hammerModeActive
                  ? 'bg-accent text-white border-accent shadow-md'
                  : 'bg-white text-secondary border-secondary/20 hover:border-accent hover:bg-accent/5'
              }`}
              title="폴더 깨기"
            >
              <span className="text-xl">🔨</span>
            </button>
            
            <button
              onClick={handleToggleLighterMode}
              className={`group relative px-4 py-2 rounded-lg border-2 transition-all ${
                lighterModeActive
                  ? 'bg-red-500 text-white border-red-500 shadow-md'
                  : 'bg-white text-secondary border-secondary/20 hover:border-red-500 hover:bg-red-50'
              }`}
              title="라이터로 태우기"
            >
              <span className="text-xl">{lighterModeActive ? '🔦' : '🪔'}</span>
            </button>
          </div>
        </div>
              <MemoGrid
                onMemoClick={handleMemoClick}
                onNewMemo={handleNewMemo}
                onNewFolder={handleNewFolder}
                onFolderClick={handleFolderClick}
                onBreakFolder={handleBreakFolder}
                onPressStart={handlePressStart}
                onPressEnd={handlePressEnd}
                onPressCancel={handlePressCancel}
                memos={currentMemos}
                folders={currentFolders}
                pinModeActive={pinModeActive}
                hammerModeActive={hammerModeActive}
                lighterModeActive={lighterModeActive}
                burningItemId={burningItemId}
                pressingItemId={pressingItemId}
                pressProgress={pressProgress}
                setPressProgress={setPressProgress}
                folderCracks={folderCracks}
              />
      </div>
    </div>
  )
}

