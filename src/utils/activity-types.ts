const ActivityTypes: ActivityType[] = [
  {
    name: 'login',
    label: 'login'
  },
  {
    name: 'logout',
    label: 'logout'
  },
  {
    name: 'create_user',
    label: 'user create'
  },
  {
    name: 'delete_user',
    label: 'user delete'
  },
  {
    name: 'edit_user',
    label: 'user edit'
  },
  {
    name: 'create_project',
    label: 'project create'
  },
  {
    name: 'delete_project',
    label: 'project delete'
  },
  {
    name: 'edit_project',
    label: 'project edit'
  },
  {
    name: 'create_batch',
    label: 'batch create'
  },
  {
    name: 'delete_batch',
    label: 'batch delete'
  },
  {
    name: 'edit_batch',
    label: 'batch edit'
  },
  {
    name: 'create_item',
    label: 'eitem create'
  },
  {
    name: 'delete_item',
    label: 'item delete'
  },
  {
    name: 'edit_item',
    label: 'item edit'
  }
]

export enum AuditType {
  LOGIN = 'login',
  LOGOUT = 'logout',

  CREATE_USER = 'create_user',
  DELETE_USER = 'delete_user',
  EDIT_USER = 'edit_user',

  CREATE_PROJECT = 'create_project',
  DELETE_PROJECT = 'delete_project',
  EDIT_PROJECT = 'edit_project',

  CREATE_BATCH = 'create_batch',
  DELETE_BATCH = 'delete_batch',
  EDIT_BATCH = 'edit_batch',

  CREATE_ITEM = 'create_item',
  DELETE_ITEM = 'delete_item',
  EDIT_ITEM = 'edit_item'
}

export const getActivityTypeLabel = (type: AuditType) => {
  const foundType = ActivityTypes.find((t) => t.name === type)
  return foundType !== undefined ? foundType.label : type
}

export default ActivityTypes
