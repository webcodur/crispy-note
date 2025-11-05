import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-pretendard',
})

export const metadata: Metadata = {
  title: 'Crispy Note - 자유롭게 작성하고, 편하게 구겨서 버린다',
  description: '부담 없이 끄적이고, 마음대로 버리는 당신의 디지털 메모지',
  keywords: ['메모', '노트', 'memo', 'notes', 'crispy-note'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={notoSansKr.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

