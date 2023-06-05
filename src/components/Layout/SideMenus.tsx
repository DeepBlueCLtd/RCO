import React from 'react'
import { type Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Menu, MenuItemLink } from 'react-admin'
import { LibraryBooks, Home } from '@mui/icons-material'
import * as constants from '../../constants'
import useCanAccess from '../../hooks/useCanAccess'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .RaMenuItemLink-active': {
      background: theme.palette.primary.light,
      color: theme.palette.common.white,
      '& svg': {
        fill: theme.palette.common.white
      }
    }
  }
}))

export const SideMenus = (): React.ReactElement => {
  const styles = useStyles()
  const { hasAccess, loading } = useCanAccess()

  if (loading) return <></>

  return (
    <Menu className={styles.root}>
      <MenuItemLink to={'/'} primaryText='Welcome' leftIcon={<Home />} />
      {hasAccess(constants.R_PLATFORMS, { read: true }) && (
        <Menu.ResourceItem name={constants.R_PLATFORMS} />
      )}
      {hasAccess(constants.R_PROJECTS, { read: true }) && (
        <Menu.ResourceItem name={constants.R_PROJECTS} />
      )}
      {hasAccess(constants.R_BATCHES, { read: true }) && (
        <Menu.ResourceItem name={constants.R_BATCHES} />
      )}
      {hasAccess(constants.R_ITEMS, { read: true }) && (
        <Menu.ResourceItem name={constants.R_ITEMS} />
      )}
      {hasAccess(constants.R_ALL_ITEMS, { read: true }) && (
        <Menu.ResourceItem name={constants.R_ALL_ITEMS} />
      )}
      {hasAccess(constants.R_VAULT_LOCATION, { read: true }) && (
        <Menu.ResourceItem name={constants.R_VAULT_LOCATION} />
      )}
      {hasAccess(constants.R_PLATFORMS, { read: true }) && (
        <Menu.ResourceItem name={constants.R_PLATFORMS} />
      )}
      {hasAccess(constants.R_USERS, { read: true }) && (
        <Menu.ResourceItem name={constants.R_USERS} />
      )}
      {hasAccess(constants.R_DISPATCH, { read: true }) && (
        <Menu.ResourceItem name={constants.R_DISPATCH} />
      )}
      {hasAccess(constants.R_ITEMS, { read: true }) && (
        <Menu.ResourceItem name={constants.R_DESTRUCTION} />
      )}
      {hasAccess('reference-data', { read: true }) && (
        <Menu.Item
          to='/reference-data'
          primaryText='Reference Data'
          leftIcon={<LibraryBooks />}
        />
      )}
    </Menu>
  )
}
