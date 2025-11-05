'use client'

import { FiSearch, FiUser, FiLogOut } from 'react-icons/fi'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMemoStore } from '@/lib/store'
import { useAuth, useLogout } from '@/lib/hooks/useAuth'

export function Header() {
  const router = useRouter()
  const { setSearchQuery } = useMemoStore()
  const { isAuthenticated, user } = useAuth()
  const { logout } = useLogout()
  const [search, setSearch] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    setSearchQuery(value)
  }

  return (
    <header className="h-16 bg-white border-b border-secondary/10 px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40"
            size={20}
          />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="메모 검색..."
            className="w-full pl-10 pr-4 py-2 bg-primary rounded-lg border border-secondary/10 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary">
              <FiUser size={16} className="text-secondary" />
              <span className="text-sm text-secondary">
                {user?.email?.split('@')[0] || '사용자'}
              </span>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 hover:bg-primary rounded-lg transition-colors"
              title="로그아웃"
            >
              <FiLogOut size={20} className="text-secondary" />
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push('/auth/login')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-secondary/10 hover:bg-primary transition-colors"
          >
            <FiUser size={18} className="text-secondary" />
            <span className="text-sm font-medium text-secondary">로그인</span>
          </button>
        )}
      </div>
    </header>
  )
}

