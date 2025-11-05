'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTrash2, FiEdit2 } from 'react-icons/fi'

interface FolderCardProps {
  id: string
  name: string
  color?: string
  memoCount?: number
  onClick: () => void
  onDelete: () => void
  onRename: (newName: string) => void
  onPressStart?: () => void
  onPressEnd?: () => void
  onPressCancel?: () => void
  isNewFolder?: boolean
  hammerModeActive?: boolean
  lighterModeActive?: boolean
  isBurning?: boolean
  isPressing?: boolean
  pressProgress?: number
  setPressProgress?: (progress: number) => void
  crackLevel?: number
}

export function FolderCard({
  id,
  name,
  color = '#6D5A43',
  memoCount = 0,
  onClick,
  onDelete,
  onRename,
  onPressStart,
  onPressEnd,
  onPressCancel,
  isNewFolder = false,
  hammerModeActive = false,
  lighterModeActive = false,
  isBurning = false,
  isPressing = false,
  pressProgress = 0,
  setPressProgress,
  crackLevel = 0,
}: FolderCardProps) {
  const [isEditing, setIsEditing] = useState(isNewFolder)
  const [editName, setEditName] = useState(name)
  const [isAnimating, setIsAnimating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleSave = () => {
    const trimmedName = editName.trim()
    if (trimmedName && trimmedName !== name) {
      onRename(trimmedName)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditName(name)
      setIsEditing(false)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  const handleCardClick = () => {
    if (!isEditing) {
      if (hammerModeActive) {
        if (crackLevel >= 2) {
          setIsAnimating(true)
          setTimeout(() => {
            onClick()
          }, 500)
        } else {
          onClick()
        }
      } else if (lighterModeActive) {
        // 라이터 모드에서는 클릭으로 동작 안함
      } else {
        onClick()
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (lighterModeActive && !isEditing) {
      e.stopPropagation()
      onPressStart?.()
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (lighterModeActive && !isEditing) {
      e.stopPropagation()
      onPressEnd?.()
    }
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (lighterModeActive && isPressing && !isEditing) {
      e.stopPropagation()
      onPressCancel?.()
    }
  }

  const hoverClass = hammerModeActive 
    ? 'hover:ring-4 hover:ring-orange-400 hover:shadow-xl' 
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
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`folder-card cursor-pointer relative group ${hoverClass} ${
        isAnimating ? (hammerModeActive || crackLevel >= 2 ? 'shatter-animation' : 'burn-animation') : ''
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
      {/* 박스 모양 SVG */}
      <div className="relative aspect-[5/4]">
        <svg
          viewBox="0 0 200 160"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
        >
          {/* 박스 몸체 */}
          <rect
            x="10"
            y="40"
            width="180"
            height="110"
            rx="6"
            fill={color}
            stroke={color}
            strokeWidth="3"
            opacity="0.9"
          />
          {/* 박스 탭 (폴더 형태) */}
          <path
            d="M 10 40 L 10 28 Q 10 22 16 22 L 55 22 L 65 32 L 95 32 Q 101 32 101 38 L 101 40"
            fill={color}
            stroke={color}
            strokeWidth="3"
          />
          
          {/* 금(Crack) 표시 */}
          {crackLevel >= 1 && (
            <g opacity="0.8">
              <path
                d="M 60 50 L 80 70 L 75 90 L 85 110 L 100 130"
                stroke="#000000"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 80 70 L 100 75 L 95 85"
                stroke="#000000"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          )}
          {crackLevel >= 2 && (
            <g opacity="0.8">
              <path
                d="M 140 55 L 125 75 L 130 95 L 115 120"
                stroke="#000000"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 125 75 L 110 80 L 115 90"
                stroke="#000000"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 50 100 L 70 110 L 60 125"
                stroke="#000000"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          )}
        </svg>

        {/* 폴더 내용 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="text-4xl mb-2">📁</div>
          
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="text-center text-sm font-semibold text-secondary bg-white border border-accent rounded px-2 py-1 w-32 focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3 className="text-sm font-semibold text-secondary line-clamp-1 text-center px-2">
              {name}
            </h3>
          )}

          <p className="text-xs text-secondary/60 mt-1">
            메모 {memoCount}개
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            className="p-1 rounded bg-white/80 hover:bg-white transition-colors text-secondary/60 hover:text-accent"
            title="이름 변경"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded bg-white/80 hover:bg-white transition-colors text-secondary/60 hover:text-accent"
            title="삭제"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

