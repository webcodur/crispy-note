'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'default' | 'danger'
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 pointer-events-auto"
            >
              {/* Title */}
              <h3 className="text-xl font-bold text-secondary mb-3">
                {title}
              </h3>

              {/* Message */}
              <p className="text-secondary/70 mb-6 whitespace-pre-line">
                {message}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg border border-secondary/20 hover:bg-primary transition-colors text-secondary"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                    variant === 'danger'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-accent hover:brightness-90 text-white'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

