'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiTrash2 } from 'react-icons/fi'
import { formatDate } from '@/lib/utils'

interface MemoCardProps {
  id: string
  title: string
  content: string
  isPinned: boolean
  tags: string[]
  updatedAt: string
  onClick: () => void
  onDelete: () => void
  onTogglePin: () => void
  onPressStart?: () => void
  onPressEnd?: () => void
  onPressCancel?: () => void
  pinModeActive?: boolean
  lighterModeActive?: boolean
  isBurning?: boolean
  isPressing?: boolean
  pressProgress?: number
  setPressProgress?: (progress: number) => void
}

export function MemoCard({
  id,
  title,
  content,
  isPinned,
  tags,
  updatedAt,
  onClick,
  onDelete,
  onTogglePin,
  onPressStart,
  onPressEnd,
  onPressCancel,
  pinModeActive = false,
  lighterModeActive = false,
  isBurning = false,
  isPressing = false,
  pressProgress = 0,
  setPressProgress,
}: MemoCardProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isBurning) {
      setIsAnimating(true)
    }
  }, [isBurning])

  useEffect(() => {
    if (isPressing && setPressProgress) {
      const startTime = Date.now()
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min((elapsed / 3000) * 100, 100)
        setPressProgress(progress)
      }, 16)
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPressing, setPressProgress])

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (pinModeActive) {
      e.stopPropagation()
      onTogglePin()
    } else if (lighterModeActive) {
      e.stopPropagation()
    } else {
      onClick()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (lighterModeActive) {
      e.stopPropagation()
      onPressStart?.()
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (lighterModeActive) {
      e.stopPropagation()
      onPressEnd?.()
    }
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (lighterModeActive && isPressing) {
      e.stopPropagation()
      onPressCancel?.()
    }
  }

  const hoverClass = pinModeActive 
    ? 'hover:ring-2 hover:ring-accent hover:shadow-lg' 
    : lighterModeActive 
    ? 'hover:ring-4 hover:ring-orange-400 hover:shadow-xl' 
    : ''

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`memo-card cursor-pointer relative group paper-texture ${hoverClass} ${
        isAnimating ? 'burn-animation' : ''
      }`}
    >
      {/* 라이터 불꽃 오버레이 */}
      {lighterModeActive && isPressing && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
          style={{
            background: `radial-gradient(circle at center, rgba(255, 150, 0, ${pressProgress / 200}), rgba(255, 100, 0, ${pressProgress / 300}), transparent)`,
            zIndex: 10
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="text-6xl"
              style={{
                opacity: pressProgress / 100,
                filter: `blur(${(100 - pressProgress) / 50}px)`,
                transform: `scale(${0.5 + (pressProgress / 200)})`
              }}
            >
              🔥
            </div>
          </div>
        </div>
      )}

      {/* 진행 바 */}
      {lighterModeActive && isPressing && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden" style={{ zIndex: 11 }}>
          <div 
            className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-red-600 transition-all"
            style={{ width: `${pressProgress}%` }}
          />
        </div>
      )}
      {/* 핀 아이콘 (pin된 메모만) */}
      {isPinned && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl z-10 drop-shadow-md">
          📌
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg text-secondary line-clamp-1">
          {title || '제목 없음'}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-primary transition-colors text-secondary/40"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-secondary/70 text-sm mb-3 line-clamp-3">
        {content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-secondary/50">
          {formatDate(updatedAt)}
        </span>
      </div>
    </motion.div>
  )
}

