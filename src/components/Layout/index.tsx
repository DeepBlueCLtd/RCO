import React, { useEffect, useState } from 'react'
import { Login, Loop } from '@mui/icons-material'
import { Box, Icon, Typography, Button, Switch } from '@mui/material'
import { makeStyles } from '@mui/styles'

import {
  AppBar,
  type AppBarProps,
  Layout,
  type LayoutProps,
  Logout,
  useRedirect,
  UserMenu,
  type UserMenuProps,
  useLogout
} from 'react-admin'
import { SideMenus } from './SideMenus'
import Footer from './Footer'
import AppIcon from '../../assets/app-icon.png'
import loadDefaultData from '../../utils/init-data'
import * as constants from '../../constants'
import { getUser } from '../../providers/authProvider'

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

  const [loggingPref, setLoggingPref] = useState<boolean>(
    localStorage.getItem(constants.LOGGING_ENABLED) === 'true' ?? false
  )

  const handleLogin = (): void => {
    redirect('/login')
  }

  const handleLoadData = (): void => {
    loadDefaultData(undefined).catch((error) => {
      console.log({ error })
    })
  }

  const handleHighVolumeLoadData = (): void => {
    loadDefaultData(undefined, true).catch(console.log)
  }

  const handleLoggingPrefChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    setLoggingPref(checked)
    localStorage.setItem(constants.LOGGING_ENABLED, checked.toString())

    const storageEvent = new StorageEvent('storage', {
      key: constants.LOGGING_ENABLED,
      newValue: checked.toString()
    })

    window.dispatchEvent(storageEvent)
  }

  const handleLogOut = (): void => {
    logout()
      .then(() => {
        redirect('/')
        const storageEvent = new StorageEvent('storage', {
          key: constants.AUTH_STATE_CHANGED
        })
        window.dispatchEvent(storageEvent)
      })
      .catch(console.error)
  }

  useEffect(() => {
    const user = getUser()
    setAuthenticated(user !== undefined)
  }, [])

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
      </Button>
      <div style={{ display: 'flex' }}>
        <Switch checked={loggingPref} onChange={handleLoggingPrefChange} />
        <Button>
          <Typography sx={{ textTransform: 'none' }}>Logging</Typography>
        </Button>
      </div>
    </UserMenu>
  )
}

const MyAppBar = (props: AppBarProps): React.ReactElement => {
  const redirect = useRedirect()
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
      [RCO]
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
