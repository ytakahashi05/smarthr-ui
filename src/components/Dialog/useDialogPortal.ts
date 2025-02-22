import { ReactNode, RefObject, useCallback, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export function useDialogPortal(parent?: HTMLElement | RefObject<HTMLElement>) {
  const portalContainer = useRef<HTMLDivElement | null>(
    parent ?? typeof document === undefined
      ? null
      : (document.createElement('div') as HTMLDivElement),
  ).current

  useLayoutEffect(() => {
    if (!portalContainer) {
      return
    }
    const parentElement = parent && 'current' in parent ? parent.current : parent
    // SSR を考慮し、useEffect 内で初期値 document.body を指定
    const actualParent = parentElement || document.body
    actualParent.appendChild(portalContainer)
    return () => {
      actualParent.removeChild(portalContainer)
    }
  }, [parent, portalContainer])

  const wrappedCreatePortal = useCallback(
    (children: ReactNode) => {
      if (portalContainer === null) {
        return null
      }
      return createPortal(children, portalContainer)
    },
    [portalContainer],
  )

  return {
    createPortal: wrappedCreatePortal,
  }
}
