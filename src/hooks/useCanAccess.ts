import { useGetPermissions, usePermissions } from 'react-admin'
import { canAccess } from '../providers/authProvider/permissions'
import { useEffect, useState } from 'react'

interface UserCanAccess {
  hasAccess: (resource: string, actions: Permission) => boolean
  loading: boolean
}

export default function useCanAccess(): UserCanAccess {
  const { permissions: data } = usePermissions()
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
        .finally(() => { setLoading(false) })
    }
  }, [data])

  const hasAccess = (resource: string, actions: Permission): boolean => {
    return canAccess(permissions, resource, actions)
  }

  return { hasAccess, loading }
}
