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
    label: 'User created'
  },
  {
    name: 'delete_user',
    label: 'User deleted'
  },
  {
    name: 'edit_user',
    label: 'User edited'
  },
  {
    name: 'create_project',
    label: 'Project created'
  },
  {
    name: 'delete_project',
    label: 'Project deleted'
  },
  {
    name: 'edit_project',
    label: 'Project edited'
  },
  {
    name: 'create_batch',
    label: 'Batch created'
  },
  {
    name: 'delete_batch',
    label: 'Batch deleted'
  },
  {
    name: 'edit_batch',
    label: 'Batch edited'
  },
  {
    name: 'create_item',
    label: 'Item created'
  },
  {
    name: 'delete_item',
    label: 'Item deleted'
  },
  {
    name: 'edit_item',
    label: 'Item edited'
  }
]

export const getActivityTypeLabel = (type: string) => {
  const foundType = ActivityTypes.find((t) => t.name === type)
  return foundType !== undefined ? foundType.label : type
}

export default ActivityTypes
