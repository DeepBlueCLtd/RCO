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

const ActivityTypes = Object.values(AuditType).reduce<ActivityType[]>((acc, val) => {
  const replacedVal: string = val.replace('_', ' ')
  const capitalizedFirstLetter: string = replacedVal.charAt(0).toUpperCase()
  const remainingLetters: string = replacedVal.substring(1).toLowerCase()
  const convertedVal = `${capitalizedFirstLetter}${remainingLetters}`
  acc.push({
    name: val,
    label: convertedVal
  })
  return acc
}, [])

console.log({ ActivityTypes })

export const getActivityTypeLabel = (type: string) => {
  const foundType = ActivityTypes.find((t) => t.name === type)
  return foundType !== undefined ? foundType.label : type
}

export default ActivityTypes
