import React from 'react'
import { Login, Loop } from '@mui/icons-material'
import { Box, Icon, Typography , Button } from '@mui/material'
import { makeStyles } from '@mui/styles'

import {
  AppBar,
  type AppBarProps,
  Layout,
  type LayoutProps,
  Logout,
  useAuthState,
  useRedirect,
  UserMenu,
  type UserMenuProps
} from 'react-admin'
import { SideMenus } from './SideMenus'
import Footer from './Footer'
import AppIcon from '../../assets/app-icon.png'
import loadDefaultData from '../../utils/init-data'

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
  const { authenticated } = useAuthState()
  const redirect = useRedirect()

  const handleLogin = (): void => {
    redirect('/login')
  }

  const handleLoadData = (): void => {
    loadDefaultData().catch((error) => {
      console.log({ error })
    })
  }

  return (
    <UserMenu {...props}>
      {authenticated === null && (
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
      <Logout />
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
    </UserMenu>
  )
}

const MyAppBar = (props: AppBarProps): React.ReactElement => (
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
          marginTop: '5px'
        }}
      />
    </span>
    <Box flex={1} />
    [RCO]
    <Box flex={1} />
  </AppBar>
)

const MyLayout = (props: LayoutProps): React.ReactElement => (
  <Layout {...props} appBar={MyAppBar} menu={SideMenus}>
    {props.children}
    <Footer />
  </Layout>
)

export default MyLayout
