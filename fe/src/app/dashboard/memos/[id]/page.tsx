import { MemoEditorView } from '@/components/view/dashboard/MemoEditorView'

interface MemoEditorPageProps {
  params: {
    id: string
  }
}

export default function MemoEditorPage({ params }: MemoEditorPageProps) {
  return <MemoEditorView memoId={params.id} />
}

