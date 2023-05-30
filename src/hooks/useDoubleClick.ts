import { useState } from 'react'

const useDoubleClick = (
  handleClick: (id: number) => void,
  handleDoubleClick: (id: number) => void
): ((id: number) => false) => {
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null)

  const handleRowClick = (id: number): false => {
    if (clickTimer !== null) {
      clearTimeout(clickTimer)
      setClickTimer(null)
      handleDoubleClick(id)
    } else {
      setClickTimer(
        setTimeout(() => {
          setClickTimer(null)
          handleClick(id)
        }, 200)
      )
    }
    return false
  }

  return handleRowClick
}

export default useDoubleClick
