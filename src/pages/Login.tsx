import * as React from 'react'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useLogin, useNotify } from 'react-admin'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import AppIcon from '../assets/rco_transparent.png'
import * as constants from '../constants'

export default function Login(): React.ReactElement {
  const login = useLogin()
  const notify = useNotify()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const staffNumber = formData.get('staffNumber') as string
    const password = formData.get('password') as string
    login({ staffNumber, password })
      .catch(() => {
        notify('Invalid email or password', { type: 'error' })
      })
      .then(() => {
        const storageEvent = new StorageEvent('storage', {
          key: constants.AUTH_STATE_CHANGED
        })
        window.dispatchEvent(storageEvent)
      })
      .catch(console.error)
  }

  return (
    <>
      <Container
        sx={{
          backgroundImage:
            'radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)',
          minHeight: '100vh',
          minWidth: '100vw',
          paddingTop: '10%'
        }}>
        <TableContainer
          sx={{
            background: 'white',
            maxWidth: '500px',
            margin: 'auto',
            width: '100%',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center' sx={{ fontWeight: '600' }}>
                  Staff Number
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: '600' }}>
                  Password
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align='center'>d-1</TableCell>
                <TableCell align='center'>admin</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align='center'>d-2</TableCell>
                <TableCell align='center'>user</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'white',
            maxWidth: '500px',
            margin: 'auto'
          }}>
          <div style={{ paddingTop: '7%', textAlign: 'center' }}>
            <img
              src={AppIcon}
              style={{
                width: '52px',
                height: '52px',
                padding: '3px',
                marginTop: '5px'
              }}
            />
            <Typography component='h1' variant='h5'>
              Welcome to RCO
            </Typography>
          </div>
          <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{ mt: 1, padding: '5%' }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='Staff Number'
              name='staffNumber'
              autoComplete='staffNumber'
              autoFocus
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}>
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  )
}
