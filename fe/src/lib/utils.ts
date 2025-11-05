import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Memo, Folder } from './store'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: ko,
  })
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function extractFirstLine(content: string, maxLength: number = 50): string {
  const firstLine = content.split('\n')[0]
  return firstLine.length > maxLength
    ? firstLine.substring(0, maxLength) + '...'
    : firstLine
}

export function highlightText(text: string, query: string): string {
  if (!query) return text
  
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-accent/30">$1</mark>')
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// #region 폴더 유틸리티

export function buildFolderPath(
  folderId: string | null,
  folders: Folder[]
): Folder[] {
  if (!folderId) return []
  
  const path: Folder[] = []
  let currentId: string | null = folderId
  
  while (currentId) {
    const folder = folders.find(f => f.id === currentId)
    if (!folder) break
    
    path.unshift(folder)
    currentId = folder.parentId
  }
  
  return path
}

export function getFolderChildren(
  parentId: string | null,
  folders: Folder[]
): Folder[] {
  return folders.filter(f => f.parentId === parentId)
}

export function getMemosInFolder(
  folderId: string | null,
  memos: Memo[],
  includeSubfolders: boolean = false,
  folders: Folder[] = []
): Memo[] {
  if (!includeSubfolders) {
    return memos.filter(m => m.folderId === folderId)
  }
  
  const folderIds = new Set<string | null>([folderId])
  
  const addChildren = (parentId: string | null) => {
    const children = getFolderChildren(parentId, folders)
    children.forEach(child => {
      folderIds.add(child.id)
      addChildren(child.id)
    })
  }
  
  if (folderId) {
    addChildren(folderId)
  }
  
  return memos.filter(m => folderIds.has(m.folderId))
}

// #endregion
