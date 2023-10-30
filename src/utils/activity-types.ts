export enum AuditType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',

  CREATE = 'CREATE',
  DELETE = 'DELETE', // note: not used, by principle
  EDIT = 'EDIT',

  MOVED = 'MOVED',

  USER_DEPARTED = 'USER_DEPARTED',
  USER_RETURNED = 'USER_RETURNED',
  PASSWORD_RESET = 'PASSWORD_RESET',

  LOAN = 'LOAN',
  RETURN = 'VAUL',
  SENT = 'SENT',
  DESTROY = 'DEST'
}

const ActivityTypes = Object.values(AuditType).map((val) => {
  //  const replacedVal: string = val.replace('_', ' ')
  // const capitalizedFirstLetter: string = replacedVal.charAt(0).toUpperCase()
  // const remainingLetters: string = replacedVal.substring(1).toLowerCase()
  // const convertedVal = `${capitalizedFirstLetter}${remainingLetters}`
  return {
    name: val,
    label: val
  }
})

export const getActivityTypeLabel = (type: string): string => {
  return type
  // const foundType = ActivityTypes.find((t) => t.name === type)
  // return foundType !== undefined ? foundType.label : type
}

export default ActivityTypes
