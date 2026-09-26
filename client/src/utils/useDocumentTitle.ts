import { useEffect } from 'react'
export function useDocumentTitle(pageTitle: string) {
  useEffect(() => {
    document.title = `${pageTitle} - History Heroes`
  }, [pageTitle])
}
