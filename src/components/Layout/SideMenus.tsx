import React from 'react'
import { type Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Menu, MenuItemLink } from 'react-admin'
import { LibraryBooks, Home } from '@mui/icons-material'
import * as constants from '../../constants'

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
  return (
    <Menu className={styles.root}>
      <MenuItemLink to={'/'} primaryText='Welcome' leftIcon={<Home />} />
      <Menu.ResourceItem name={constants.R_PLATFORMS} />
      <Menu.ResourceItem name={constants.R_PROJECTS} />
      <Menu.ResourceItem name={constants.R_BATCHES} />
      <Menu.ResourceItem name={constants.R_ITEMS} />
      <Menu.ResourceItem name={constants.R_LOANS} />
      <Menu.ResourceItem name={constants.R_VAULT_LOCATION} />
      <Menu.ResourceItem name={constants.R_USERS} />
      <Menu.Item
        to='/reference-data'
        primaryText='Reference Data'
        leftIcon={<LibraryBooks />}
      />
    </Menu>
  )
}
