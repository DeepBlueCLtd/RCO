export enum AuditType {
  LOGIN = 'login',
  LOGOUT = 'logout',

  CREATE_USER = 'create',
  DELETE_USER = 'delete',
  EDIT_USER = 'edit',

  CREATE_PROJECT = 'create',
  DELETE_PROJECT = 'delete',
  EDIT_PROJECT = 'edit',

  CREATE_BATCH = 'create',
  DELETE_BATCH = 'delete',
  EDIT_BATCH = 'edit',

  CREATE_ITEM = 'create',
  DELETE_ITEM = 'delete',
  EDIT_ITEM = 'edit',

  ITEM_LOAN = 'loan',
  ITEM_RETURN = 'return',

  EDIT_PLATFROM = 'edit'
}

const ActivityTypes = Object.values(AuditType).map((val) => {
  const replacedVal: string = val.replace('_', ' ')
  const capitalizedFirstLetter: string = replacedVal.charAt(0).toUpperCase()
  const remainingLetters: string = replacedVal.substring(1).toLowerCase()
  const convertedVal = `${capitalizedFirstLetter}${remainingLetters}`
  return {
    name: val,
    label: convertedVal
  }
})

export const getActivityTypeLabel = (type: string): string => {
  const foundType = ActivityTypes.find((t) => t.name === type)
  return foundType !== undefined ? foundType.label : type
}

export default ActivityTypes
