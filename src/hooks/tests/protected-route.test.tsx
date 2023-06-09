import React from 'react'
import {
  canAccess,
  getPermissionsByRoles
} from '../../providers/authProvider/permissions'
import { protectedRoutes } from '../useCanAccess'
import * as constants from '../../constants'

const Element = (): React.ReactElement => <></>

const resourceRoutes: ResourceRoutes = {
  create: Element,
  show: Element,
  edit: Element,
  list: Element
}

describe('protected routes ', () => {
  it('routes for unauthorized user', () => {
    const permissions = getPermissionsByRoles(['user'])
    const { create, list, show, edit } = protectedRoutes(
      permissions,
      constants.R_ITEMS,
      resourceRoutes
    )
    expect(list).toBeDefined()
    expect(show).toBeDefined()
    expect(create).toBeUndefined()
    expect(edit).toBeUndefined()
  })

  it('routes for authorized user', () => {
    const permissions = getPermissionsByRoles(['rco-user'])
    const { create, list, show, edit } = protectedRoutes(
      permissions,
      constants.R_ITEMS,
      resourceRoutes
    )
    expect(list).toBeDefined()
    expect(show).toBeDefined()
    expect(create).toBeDefined()
    expect(edit).toBeDefined()
  })

  it('can access resource', () => {
    const permissions = getPermissionsByRoles(['rco-user'])
    const hasReadPermission = canAccess(permissions, constants.R_ITEMS, {
      read: true
    })

    expect(hasReadPermission).toBeTruthy()

    const hasDeletePermission = canAccess(permissions, constants.R_ITEMS, {
      delete: true
    })
    expect(hasDeletePermission).toBeFalsy()
  })

  it('power user can access all resource', () => {
    const permissions = getPermissionsByRoles(['rco-power-user'])
    const hasReadPermission = canAccess(permissions, '*', {
      read: true,
      write: true,
      delete: true
    })
    expect(hasReadPermission).toBeTruthy()
  })

  it('merged permissions for multiple roles', () => {
    const permissions = getPermissionsByRoles(['user', 'rco-power-user'])
    const hasAllPermissions = canAccess(permissions, '*', {
      read: true,
      write: true,
      delete: true
    })
    expect(hasAllPermissions).toBeTruthy()
  })
})
