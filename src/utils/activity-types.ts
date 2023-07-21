export enum AuditType {
  LOGIN = 'login',
  LOGOUT = 'logout',

  CREATE = 'create',
  DELETE = 'delete',
  EDIT = 'edit',

  USER_DEPARTED = 'USER_DEPARTED',
  USER_RETURNED = 'USER_RETURNED',

  LOAN = 'loan',
  RETURN = 'return',

  SENT = 'sent'
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
