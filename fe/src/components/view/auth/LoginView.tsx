'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiMail, FiLock } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { useLogin, useSocialLogin } from '@/lib/hooks/useAuth'

const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginView() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const { login } = useLogin()
  const { loginWithGoogle, loginWithGithub } = useSocialLogin()

  const onSubmit = async (data: LoginForm) => {
    await login(data.email, data.password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/30 to-paper p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl">📝</span>
            <span className="text-2xl font-bold text-secondary">Crispy Note</span>
          </Link>
          <h1 className="text-3xl font-bold text-secondary mb-2">로그인</h1>
          <p className="text-secondary/70">
            메모를 계속 작성하세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-paper p-8">
          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => loginWithGoogle()}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-secondary/10 rounded-lg hover:bg-primary transition-colors"
            >
              <FcGoogle size={24} />
              <span className="font-semibold text-secondary">Google로 로그인</span>
            </button>
            <button
              onClick={() => loginWithGithub()}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-secondary/10 rounded-lg hover:bg-primary transition-colors"
            >
              <FaGithub size={24} />
              <span className="font-semibold text-secondary">GitHub으로 로그인</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-secondary/70">또는</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                이메일
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input
                  type="email"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-3 border border-secondary/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-accent">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                비밀번호
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input
                  type="password"
                  {...register('password')}
                  className="w-full pl-10 pr-4 py-3 border border-secondary/10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                  placeholder="비밀번호"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-accent">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-secondary/10 text-accent focus:ring-accent"
                />
                <span className="text-secondary/70">로그인 상태 유지</span>
              </label>
              <Link href="/auth/forgot-password" className="text-accent hover:underline">
                비밀번호 찾기
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-accent text-white rounded-lg font-semibold hover:brightness-90 transition-all disabled:opacity-50"
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-secondary/70">
            계정이 없으신가요?{' '}
            <Link href="/auth/signup" className="text-accent hover:underline">
              회원가입
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-secondary/70">
            <Link href="/dashboard" className="text-accent hover:underline">
              회원가입 없이 둘러보기
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

