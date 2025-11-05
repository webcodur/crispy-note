'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiTrash2, FiFolder, FiTag } from 'react-icons/fi'
import { useMemoStore } from '@/lib/store'
import { debounce } from '@/lib/utils'

interface MemoEditorViewProps {
  memoId: string
}

export function MemoEditorView({ memoId }: MemoEditorViewProps) {
  const router = useRouter()
  const { getMemos, updateMemo, deleteMemo } = useMemoStore()
  const memos = getMemos()
  const memo = memos.find((m) => m.id === memoId)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isCrumpling, setIsCrumpling] = useState(false)
  const loadedMemoIdRef = useRef<string | null>(null)

  // memoId가 실제로 변경되었을 때만 데이터 로드
  useEffect(() => {
    if (memo && loadedMemoIdRef.current !== memoId) {
      setTitle(memo.title)
      setContent(memo.content)
      loadedMemoIdRef.current = memoId
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoId]) // memo를 dependency에서 제외하여 순환 참조 방지

  const debouncedUpdate = debounce((updates: any) => {
    updateMemo(memoId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  }, 500)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    debouncedUpdate({ title: newTitle })
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    debouncedUpdate({ content: newContent })
  }

  const handleDelete = () => {
    setIsCrumpling(true)
    setTimeout(() => {
      deleteMemo(memoId)
      router.push('/dashboard')
    }, 800)
  }

  if (!memo) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-secondary/70">메모를 찾을 수 없습니다</p>
      </div>
    )
  }

  return (
    <motion.div
      animate={isCrumpling ? { scale: 0.2, rotate: 45, opacity: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="h-full flex flex-col"
    >
      {/* 에디터 헤더 */}
      <div className="px-6 py-4 bg-white border-b border-secondary/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-primary rounded-lg transition-colors"
            >
              <FiArrowLeft size={20} className="text-secondary" />
            </button>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="제목 (선택)"
              className="text-xl font-semibold text-secondary bg-transparent border-none focus:outline-none w-96"
            />
            <span className="text-sm text-secondary/50">자동 저장됨</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:brightness-90 transition-all"
            >
              <FiTrash2 size={18} />
              <span>구겨서 버리기</span>
            </button>
          </div>
        </div>

        {/* 메타데이터 */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-primary rounded-lg border border-secondary/10 hover:border-accent transition-colors text-sm">
            <FiFolder size={16} />
            <span>폴더 선택</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-primary rounded-lg border border-secondary/10 hover:border-accent transition-colors text-sm">
            <FiTag size={16} />
            <span>태그 추가</span>
          </button>
        </div>
      </div>

      {/* 에디터 */}
      <div className="flex-1 overflow-hidden">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="자유롭게 작성하세요..."
          className="w-full h-full px-6 py-6 text-secondary bg-transparent resize-none border-none focus:outline-none paper-texture"
          style={{ fontSize: '16px', lineHeight: '1.8' }}
        />
      </div>

      {/* 푸터 */}
      <div className="px-6 py-3 bg-white/50 border-t border-secondary/10 text-xs text-secondary/50">
        생성: {new Date(memo.createdAt).toLocaleString('ko-KR')} | 수정:{' '}
        {new Date(memo.updatedAt).toLocaleString('ko-KR')}
      </div>

      {isCrumpling && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-50"
        >
          <p className="text-2xl font-bold text-white">
            메모를 구겨서 버렸어요! 🗑️
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

