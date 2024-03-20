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

const resources = [
  constants.R_PROJECTS,
  constants.R_BATCHES,
  constants.R_ITEMS,
  constants.R_USERS,
  constants.R_PLATFORMS,
  constants.R_VAULT_LOCATION,
  constants.R_ADDRESSES,
  constants.R_DESTRUCTION,
  constants.R_DISPATCH,
  'reference-data'
]

const checkDeletePermission = async (role: UserRole): Promise<void> => {
  const userPermissions = await getPermissionsByRoles(role)

  resources.forEach((permission) => {
    const hasDeletePermission = canAccess(userPermissions, permission, {
      delete: true
    })
    expect(hasDeletePermission).toBeFalsy()
  })
}

describe('protected routes ', () => {
  // no longer required as unauthorized users can't see any data

  // it('routes for unauthorized user', () => {
  //   const permissions = getPermissionsByRoles('user')
  //   const { create, list, show, edit } = protectedRoutes(
  //     permissions,
  //     constants.R_ITEMS,
  //     resourceRoutes
  //   )
  //   expect(list).toBeDefined()
  //   expect(show).toBeDefined()
  //   expect(create).toBeUndefined()
  //   expect(edit).toBeUndefined()
  // })

  it('routes for authorized user', async () => {
    const permissions = await getPermissionsByRoles('rco-user')
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

  it('can access resource', async () => {
    const permissions = await getPermissionsByRoles('rco-user')
    const hasReadPermission = canAccess(permissions, constants.R_ITEMS, {
      read: true
    })

    expect(hasReadPermission).toBeTruthy()

    const hasDeletePermission = canAccess(permissions, constants.R_ITEMS, {
      delete: true
    })
    expect(hasDeletePermission).toBeFalsy()
  })

  it('power user can access all resource', async () => {
    const permissions = await getPermissionsByRoles('rco-power-user')
    resources.forEach((permission) => {
      const hasAllPermissions = canAccess(permissions, permission, {
        read: true,
        write: true
      })
      expect(hasAllPermissions).toBeTruthy()
    })
  })

  it('no user is allowed to delete any resource', () => {
    const roles = ['rco-power-user', 'rco-user'] as UserRole[]
    roles.forEach((role) => {
      void checkDeletePermission(role)
    })
  })
})
