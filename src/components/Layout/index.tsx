import React, { useEffect, useState } from 'react'
import { Login } from '@mui/icons-material'
import { Box, Icon, Typography, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import mitt from 'mitt'
import {
  AppBar,
  type AppBarProps,
  Layout,
  type LayoutProps,
  Logout,
  useRedirect,
  UserMenu,
  type UserMenuProps,
  useLogout,
  useNotify,
  useResetStore
} from 'react-admin'
import { SideMenus } from './SideMenus'
import Footer from './Footer'
import AppIcon from '../../assets/app-icon.png'
import * as constants from '../../constants'
import { getUser } from '../../providers/authProvider'
import LockResetIcon from '@mui/icons-material/LockReset'
import { CHANGE_PASSWORD_EVENT } from '../../constants'
import FilterListIcon from '@mui/icons-material/FilterList'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'
// eslint-disable-next-line
type Events = {
  [CHANGE_PASSWORD_EVENT]: null
}
export const emitter = mitt<Events>()

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '36px',
    padding: '6px 16px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '& span': {
      height: 'auto',
      width: 'auto',
      lineHeight: 1
    }
  },
  startIcon: {
    margin: 0,
    minWidth: '36px'
  },
  '& .RaButton-label': {
    textTranform: 'capitalize'
  }
}))

const MyUserMenu = (props: UserMenuProps): React.ReactElement => {
  const styles = useStyles()
  const [authenticated, setAuthenticated] = useState(false)
  const logout = useLogout()
  const redirect = useRedirect()
  const notify = useNotify()
  // const [loggingPref, setLoggingPref] = useState<boolean>(
  //   localStorage.getItem(constants.LOGGING_ENABLED) === 'true' ?? false
  // )
  const handleLogin = (): void => {
    redirect('/login')
  }
  // const handleLoadData = (): void => {
  //   loadDefaultData(undefined).catch((err) =>
  //     { notify(err.message, { type: 'error' }) }
  //   )
  // }

  // const handleHighVolumeLoadData = (): void => {
  //   loadDefaultData(undefined, true).catch((err) =>
  //     { notify(err.message, { type: 'error' }) }
  //   )
  // }

  // const handleLoggingPrefChange = (
  //   _: React.ChangeEvent<HTMLInputElement>,
  //   checked: boolean
  // ): void => {
  //   setLoggingPref(checked)
  //   localStorage.setItem(constants.LOGGING_ENABLED, checked.toString())

  //   const storageEvent = new StorageEvent('storage', {
  //     key: constants.LOGGING_ENABLED,
  //     newValue: checked.toString()
  //   })

  //   window.dispatchEvent(storageEvent)
  // }
  const handleLogOut = (): void => {
    logout()
      .then(() => {
        redirect('/login')
        const storageEvent = new StorageEvent('storage', {
          key: constants.AUTH_STATE_CHANGED
        })
        window.dispatchEvent(storageEvent)
      })
      .catch((err) => {
        notify(err.message, { type: 'error' })
      })
  }

  useEffect(() => {
    const user = getUser()
    setAuthenticated(user !== undefined)
  }, [])
  const reset = useResetStore()
  const redircet = useRedirect()
  const resetFilter = (): void => {
    reset()
    redircet('/')
  }
  return (
    <UserMenu {...props}>
      {!authenticated && (
        <Button
          onClick={handleLogin}
          classes={{ root: styles.root, startIcon: styles.startIcon }}
          startIcon={
            <Icon>
              <Login sx={{ width: '20px', height: '20px' }} />
            </Icon>
          }>
          <Typography sx={{ textTransform: 'none' }}> Login</Typography>
        </Button>
      )}
      {authenticated && <Logout onClick={handleLogOut} />}
      <Button
        onClick={() => {
          emitter.emit(CHANGE_PASSWORD_EVENT, null)
        }}
        sx={{
          color: '#383838',
          fontSize: '14px',
          paddingY: '6px',
          paddingX: '16px',
          textTransform: 'capitalize',
          '& .MuiSvgIcon-root': {
            marginRight: '11px'
          }
        }}
        classes={{ root: styles.root, startIcon: styles.startIcon }}>
        <LockResetIcon />
        Change Password
      </Button>
      <Button
        onClick={() => {
          reset()
        }}
        classes={{ root: styles.root, startIcon: styles.startIcon }}
        sx={{
          color: '#383838',
          fontSize: '14px',
          paddingY: '6px',
          paddingX: '16px',
          textTransform: 'capitalize',
          '& .MuiSvgIcon-root': {
            marginRight: '15px'
          }
        }}>
        <ViewWeekIcon fontSize='small' />
        Restore default columns
      </Button>

      <Button
        onClick={resetFilter}
        classes={{ root: styles.root, startIcon: styles.startIcon }}
        sx={{
          color: '#383838',
          fontSize: '14px',
          paddingY: '6px',
          paddingX: '16px',
          textTransform: 'capitalize',
          '& .MuiSvgIcon-root': {
            marginRight: '11px'
          }
        }}>
        <FilterListIcon />
        Reset all filters
      </Button>

      {/* <Button
        classes={{ root: styles.root, startIcon: styles.startIcon }}
        onClick={handleLoadData}
        startIcon={
          <Icon>
            <Loop sx={{ width: '20px', height: '20px' }} />
          </Icon>
        }>
        <Typography sx={{ textTransform: 'none' }}>Load data</Typography>
      </Button>
      <Button
        classes={{ root: styles.root, startIcon: styles.startIcon }}
        onClick={handleHighVolumeLoadData}
        startIcon={
          <Icon>
            <Loop sx={{ width: '20px', height: '20px' }} />
          </Icon>
        }>
        <Typography sx={{ textTransform: 'none' }}>
          Load data (high volume)
        </Typography>
      </Button> */}
      {/* <div style={{ display: 'flex' }}>
        <Switch checked={loggingPref} onChange={handleLoggingPrefChange} />
        <Button>
          <Typography sx={{ textTransform: 'none' }}>Logging</Typography>
        </Button>
      </div> */}
    </UserMenu>
  )
}

const MyAppBar = (props: AppBarProps): React.ReactElement => {
  const redirect = useRedirect()
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <AppBar {...props} userMenu={<MyUserMenu />}>
      <span
        style={{
          backgroundColor: 'white',
          borderRadius: '50px',
          width: '35px',
          height: '35px',
          display: 'flex',
          justifyContent: 'center'
        }}>
        <img
          src={AppIcon}
          style={{
            width: '28px',
            height: '28px',
            padding: '3px',
            marginTop: '5px',
            cursor: 'pointer'
          }}
          onClick={() => {
            redirect('/')
          }}
        />
      </span>
      <Box flex={1} />
      {isDevelopment ? ' [VAL_DEV]' : '[VAL]'}
      <Box flex={1} />
    </AppBar>
  )
}

const MyLayout = (props: LayoutProps): React.ReactElement => (
  <Layout {...props} appBar={MyAppBar} menu={SideMenus}>
    {props.children}
    <div style={{ marginTop: '30px' }}>
      <Footer />
    </div>
  </Layout>
)

export default MyLayout
