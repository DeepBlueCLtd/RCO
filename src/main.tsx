import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import NotificationContext from './context/NotificationContext'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const render = (): void => {
  root.render(
    <React.StrictMode>
      <NotificationContext>
        <App />
      </NotificationContext>
    </React.StrictMode>
  )
}

if (process.env.VITE_DEMO) {
  // hosted demo: the backend runs in the browser (see src/demo/)
  root.render(<p style={{ fontFamily: 'sans-serif' }}>Loading demo…</p>)
  import('./demo')
    .then(async ({ startDemoBackend }) => {
      await startDemoBackend()
      render()
    })
    .catch((error: Error) => {
      root.render(
        <p style={{ fontFamily: 'sans-serif' }}>
          The demo could not start: {error.message}
        </p>
      )
    })
} else {
  render()
}
