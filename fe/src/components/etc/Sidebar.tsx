'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  FiFolder,
  FiTrash2,
  FiSettings,
  FiPlus,
  FiHardDrive,
  FiCloud,
} from 'react-icons/fi'
import { useMemoStore } from '@/lib/store'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const {
    selectedFolder,
    setSelectedFolder,
    storageType,
    setStorageType,
    localFolders,
    cloudFolders,
  } = useMemoStore()
  
  const folders = storageType === 'local' ? localFolders : cloudFolders

  const handleStorageTypeChange = (type: 'local' | 'cloud') => {
    if (type === 'cloud' && !isAuthenticated) {
      router.push('/auth/login')
      return
    }
    setStorageType(type)
    setSelectedFolder(null)
  }

  return (
    <aside className="w-64 h-screen bg-primary/30 border-r border-secondary/10 flex flex-col">
      {/* 로고 */}
      <div className="p-6 border-b border-secondary/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <span className="text-xl font-bold text-secondary">Crispy Note</span>
        </Link>
      </div>

      {/* 메인 네비게이션 */}
      <nav className="flex-1 overflow-y-auto p-4">
        {/* 스토리지 탭 */}
        <div className="mb-4">
          <div className="flex gap-1 p-1 bg-primary rounded-lg">
            <button
              onClick={() => handleStorageTypeChange('local')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                storageType === 'local'
                  ? 'bg-white text-secondary shadow-sm'
                  : 'text-secondary/60 hover:text-secondary'
              )}
            >
              <FiHardDrive size={16} />
              <span>로컬</span>
            </button>
            <button
              onClick={() => handleStorageTypeChange('cloud')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                storageType === 'cloud'
                  ? 'bg-white text-secondary shadow-sm'
                  : 'text-secondary/60 hover:text-secondary',
                !isAuthenticated && 'opacity-50'
              )}
            >
              <FiCloud size={16} />
              <span>클라우드</span>
            </button>
          </div>
        </div>

        {/* 폴더 목록 */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-4 py-2 mb-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
              <FiFolder size={16} />
              <span>폴더</span>
            </div>
            <button className="p-1 hover:bg-primary rounded transition-colors">
              <FiPlus size={16} className="text-secondary" />
            </button>
          </div>
          <div className="space-y-1">
            {folders.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-secondary/50">
                {storageType === 'cloud' && !isAuthenticated
                  ? '로그인이 필요합니다'
                  : '폴더가 없습니다'}
              </div>
            ) : (
              folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-left',
                    selectedFolder === folder.id
                      ? 'bg-accent/20 text-accent'
                      : 'text-secondary/70 hover:bg-primary'
                  )}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: folder.color || '#6D5A43' }}
                  />
                  <span className="text-sm">{folder.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </nav>

      {/* 하단 네비게이션 */}
      <div className="p-4 border-t border-secondary/10 space-y-1">
        <Link
          href="/dashboard/trash"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-secondary hover:bg-primary transition-colors"
        >
          <FiTrash2 size={20} />
          <span>휴지통</span>
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-secondary hover:bg-primary transition-colors"
        >
          <FiSettings size={20} />
          <span>설정</span>
        </Link>
      </div>
    </aside>
  )
}
