import React, { useMemo } from 'react'
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

  const accessStates = useMemo(() => {
    return {
      batchHasAccess: hasAccess(constants.R_BATCHES, { read: true }),
      itemsHasAccess: hasAccess(constants.R_ITEMS, { read: true }),
      vaultLocationHasAccess: hasAccess(constants.R_VAULT_LOCATION, {
        read: true
      }),
      projectsHasAccess: hasAccess(constants.R_PROJECTS, { read: true }),
      platformsHasAccess: hasAccess(constants.R_PLATFORMS, { read: true }),
      usersHasAccess: hasAccess(constants.R_USERS, { read: true }),
      referenceDataHasAccess: hasAccess('reference-data', { read: true }),
      dispatchHasAccess: hasAccess(constants.R_DISPATCH, { read: true })
    }
  }, [loading])

  if (loading) return <></>

  return (
    <Menu className={styles.root}>
      <MenuItemLink to={'/'} primaryText='Welcome' leftIcon={<Home />} />
      {accessStates.platformsHasAccess && (
        <Menu.ResourceItem name={constants.R_PLATFORMS} />
      )}
      {accessStates.projectsHasAccess && (
        <Menu.ResourceItem name={constants.R_PROJECTS} />
      )}
      {accessStates.batchHasAccess && (
        <Menu.ResourceItem name={constants.R_BATCHES} />
      )}
      {accessStates.itemsHasAccess && (
        <Menu.ResourceItem name={constants.R_ITEMS} />
      )}
      {accessStates.vaultLocationHasAccess && (
        <Menu.ResourceItem name={constants.R_VAULT_LOCATION} />
      )}
      {accessStates.platformsHasAccess && (
        <Menu.ResourceItem name={constants.R_PLATFORMS} />
      )}
      {accessStates.usersHasAccess && (
        <Menu.ResourceItem name={constants.R_USERS} />
      )}
      {accessStates.dispatchHasAccess && (
        <Menu.ResourceItem name={constants.R_DISPATCH} />
      )}
      {accessStates.itemsHasAccess && (
        <Menu.ResourceItem name={constants.R_DESTRUCTION} />
      )}
      {accessStates.referenceDataHasAccess && (
        <Menu.Item
          to='/reference-data'
          primaryText='Reference Data'
          leftIcon={<LibraryBooks />}
        />
      )}
    </Menu>
  )
}
