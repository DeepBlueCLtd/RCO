import { Alert, type AlertColor, Snackbar } from '@mui/material'
import { type PropsWithChildren, createContext, useContext, useState } from 'react'

interface Options { type?: AlertColor }
type NotifyFunction = (message: string, options?: Options) => void

export const Context = createContext<{ notify: NotifyFunction }>({
  notify: () => {}
})

export default function NotificationContext(
  props: PropsWithChildren
): React.ReactElement {
  const [type, setType] = useState<AlertColor>('info')
  const [message, setMessage] = useState('')

  const handleClose = (): void => {
    setMessage('')
    setTimeout(() => {
      setType('info')
    }, 500)
  }

  const notify = (
    message: string,
    options: Options = { type: 'info' }
  ): void => {
    setMessage(message)
    setType(options.type ?? 'info')
  }

  return (
    <Context.Provider value={{ notify }}>
      <Snackbar
        open={Boolean(message)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={null}>
        <Alert
          onClose={handleClose}
          severity={type}
          sx={{ width: '100%', fontSize: 18 }}>
          {message}
        </Alert>
      </Snackbar>
      {props.children}
    </Context.Provider>
  )
}

export const useCustomNotify = (): { notify: NotifyFunction } =>
  useContext(Context)
