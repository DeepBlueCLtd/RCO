import { usePermissions } from 'react-admin'
import { canAccess } from '../providers/authProvider/permissions'

interface UserCanAccess {
  hasAccess: (resource: string, actions: Permission) => boolean
}

export default function useCanAccess(): UserCanAccess {
  const { permissions } = usePermissions()

  const hasAccess = (resource: string, actions: Permission): boolean => {
    return canAccess(permissions, resource, actions)
  }

  return { hasAccess }
}
