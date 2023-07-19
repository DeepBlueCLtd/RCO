import { useEffect, useState } from 'react'
import { useStore } from 'react-admin'

interface UseOverflow {
  overflow: boolean
  clientWidth: number
  scrollWidth: number
}

export default function useOverflow(
  selector: string,
  preferenceKey?: string
): UseOverflow {
  const [overflow, setOverflow] = useState<boolean>(false)
  const [clientWidth, setClientWidth] = useState<number>(0)
  const [scrollWidth, setScrollWidth] = useState<number>(0)
  const [columnsSelected = []] = useStore<any[]>(
    `preferences.${preferenceKey}.columns`
  )

  const checkOverflow = (): void => {
    const element = document.querySelector(selector) as HTMLElement
    setClientWidth(element.clientWidth)
    setScrollWidth(element.scrollWidth)
    const overflow = element.clientWidth < element.scrollWidth
    setOverflow(overflow)
  }

  useEffect(checkOverflow, [columnsSelected])

  return { overflow, scrollWidth, clientWidth }
}
