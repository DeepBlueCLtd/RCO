import React from 'react'
import { type Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Menu } from 'react-admin'

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
      <Menu.ResourceItem name='users' />
      <Menu.ResourceItem name='audit' />
      <Menu.ResourceItem name='platforms' />
      <Menu.ResourceItem name='projects' />
      <Menu.ResourceItem name='batches' />
      <Menu.ResourceItem name='organisation' />
      <Menu.ResourceItem name='protective-marking' />
      <Menu.ResourceItem name='department' />
      <Menu.ResourceItem name='vault-location' />
      <Menu.ResourceItem name='platform-originator' />
      <Menu.ResourceItem name='media-type' />
      <Menu.ResourceItem name='protective-marking-authority' />
    </Menu>
  )
}
