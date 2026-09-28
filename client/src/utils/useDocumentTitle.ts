import { useEffect } from 'react'
export function useDocumentTitle(pageTitle: string | undefined) {
  const siteName = 'History Heroes'
  useEffect(() => {
    if (!pageTitle) {
      document.title = siteName
    } else {
      document.title = `${pageTitle} - ${siteName}`
    }

    return () => {
      document.title = siteName
    }
  }, [pageTitle])
}
