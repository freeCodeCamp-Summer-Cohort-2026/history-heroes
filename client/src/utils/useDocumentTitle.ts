import { useEffect } from 'react'
export function useDocumentTitle(pageTitle: string | undefined) {
  useEffect(() => {
    if (!pageTitle) {
      document.title = 'History Heroes'
    }
    document.title = `${pageTitle} - History Heroes`
  }, [pageTitle])
}
