'use client'

import { FiHome, FiChevronRight } from 'react-icons/fi'

interface BreadcrumbItem {
  id: string | null
  name: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  onNavigate: (folderId: string | null) => void
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-secondary/70 mb-4">
      {/* 홈 */}
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1 hover:text-accent transition-colors p-1 rounded hover:bg-primary"
        title="홈"
      >
        <FiHome size={16} />
        <span>홈</span>
      </button>

      {/* 폴더 경로 */}
      {items.map((item, index) => (
        <div key={item.id || 'root'} className="flex items-center gap-2">
          <FiChevronRight size={14} className="text-secondary/40" />
          <button
            onClick={() => onNavigate(item.id)}
            className={`hover:text-accent transition-colors p-1 rounded hover:bg-primary ${
              index === items.length - 1 ? 'font-semibold text-secondary' : ''
            }`}
          >
            {item.name}
          </button>
        </div>
      ))}
    </nav>
  )
}


