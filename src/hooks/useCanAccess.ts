import { useGetPermissions, usePermissions } from 'react-admin'
import { canAccess } from '../providers/authProvider/permissions'
import { useEffect, useState } from 'react'

interface UserCanAccess {
  hasAccess: (resource: string, actions: Permission) => boolean
  loading: boolean
}

export default function useCanAccess(): UserCanAccess {
  const { permissions: data } = usePermissions({}, { staleTime: 0 })
  const [permissions, setPermissions] = useState<ResourcePermissions>(data)
  const getPermissions = useGetPermissions()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(typeof data === 'undefined')
    setPermissions(data)
    if (typeof data === 'undefined') {
      getPermissions()
        .then(setPermissions)
        .catch(console.log)
        .finally(() => {
          setLoading(false)
        })
    }
  }, [data])

  const hasAccess = (resource: string, actions: Permission): boolean => {
    return canAccess(permissions, resource, actions)
  }

  return { hasAccess, loading }
}

export const protectedRoutes = (
  permissions: ResourcePermissions,
  resource: string,
  routes: ResourceRoutes
): ResourceRoutes => {
  const permission =
    typeof permissions[resource] !== 'undefined'
      ? permissions[resource]
      : { read: false, write: false }

  if (typeof permission === 'undefined') return {}

  const { write, read } = permission

  const hastReadPermission = !!(typeof read !== 'undefined' && read)

  const hastWritePermission =
    !!(hastReadPermission && typeof write !== 'undefined' && write)

  return {
    create: hastWritePermission ? routes.create : undefined,
    edit: hastWritePermission ? routes.edit : undefined,
    list: hastReadPermission ? routes.list : undefined,
    show: hastReadPermission ? routes.show : undefined
  }
}
