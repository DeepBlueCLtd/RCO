import React from 'react'
import { Create, Edit } from 'react-admin'
import UserForm from './UserForm'
import * as constants from '../../constants'
import useAudit from '../../hooks/useAudit'
import { AuditType } from '../../utils/activity-types'

const UserList = React.lazy(async () => await import('./UserList'))
const UserShow = React.lazy(async () => await import('./UserShow'))

const UserCreate = (): React.ReactElement => {
  const path: string = `/${constants.R_USERS}`

  return (
    <Create resource={constants.R_USERS} redirect={path}>
      <UserForm />
    </Create>
  )
}

const UserEdit = (): React.ReactElement => {
  const path: string = `/${constants.R_USERS}`
  const audit = useAudit()

  return (
    <Edit
      mutationOptions={{
        onSuccess: async (data: User) => {
          await audit({
            resource: constants.R_USERS,
            activityType: AuditType.EDIT,
            dataId: data.id ,
            activityDetail: 'User edited',
            securityRelated: true,
            subjectResource: null,
            subjectId: null
          })
        }
      }}
      mutationMode={constants.MUTATION_MODE}
      resource={constants.R_USERS}
      redirect={path}>
      <UserForm isEdit />
    </Edit>
  )
}

const users = {
  create: UserCreate,
  edit: UserEdit,
  list: UserList,
  show: UserShow
}

export default users
