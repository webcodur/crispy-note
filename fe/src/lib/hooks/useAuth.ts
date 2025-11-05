'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useMemoStore } from '@/lib/store'
import toast from 'react-hot-toast'
import type { User, Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { setStorageType } = useMemoStore()

  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // 로그인 상태에 따라 스토리지 타입 설정
      if (session?.user) {
        setStorageType('cloud')
      }
    })

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      // 로그인/로그아웃 시 스토리지 타입 변경
      if (session?.user) {
        setStorageType('cloud')
      } else {
        setStorageType('local')
      }
    })

    return () => subscription.unsubscribe()
  }, [setStorageType])

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
  }
}

export function useLogin() {
  const router = useRouter()
  const { setStorageType } = useMemoStore()

  return {
    login: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          setStorageType('cloud')
          toast.success('로그인되었습니다')
          router.push('/dashboard')
        }

        return { data, error: null }
      } catch (error: any) {
        toast.error(error.message || '로그인에 실패했습니다')
        return { data: null, error }
      }
    },
  }
}

export function useSignup() {
  const router = useRouter()
  const { setStorageType } = useMemoStore()

  return {
    signup: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          setStorageType('cloud')
          toast.success('회원가입이 완료되었습니다')
          router.push('/dashboard')
        }

        return { data, error: null }
      } catch (error: any) {
        toast.error(error.message || '회원가입에 실패했습니다')
        return { data: null, error }
      }
    },
  }
}

export function useLogout() {
  const router = useRouter()
  const { setStorageType } = useMemoStore()

  return {
    logout: async () => {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        setStorageType('local')
        toast.success('로그아웃되었습니다')
        router.push('/dashboard')
      } catch (error: any) {
        toast.error(error.message || '로그아웃에 실패했습니다')
      }
    },
  }
}

export function useSocialLogin() {
  const router = useRouter()
  const { setStorageType } = useMemoStore()

  return {
    loginWithGoogle: async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        })
        if (error) throw error
      } catch (error: any) {
        toast.error(error.message || 'Google 로그인에 실패했습니다')
      }
    },
    loginWithGithub: async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        })
        if (error) throw error
      } catch (error: any) {
        toast.error(error.message || 'GitHub 로그인에 실패했습니다')
      }
    },
  }
}
