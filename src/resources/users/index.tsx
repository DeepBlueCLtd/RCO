import React, { useState } from 'react'
import { Create, Edit, useEditContext } from 'react-admin'
import UserForm from './UserForm'
import * as constants from '../../constants'
import useAudit from '../../hooks/useAudit'
import { AuditType } from '../../utils/activity-types'
import { getDifference } from '../../providers/dataProvider/dataprovider-utils'

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
  const [prev, setPrev] = useState<User>()

  return (
    <Edit
      mutationOptions={{
        onSuccess: async (data: User) => {
          await audit({
            resource: constants.R_USERS,
            activityType: AuditType.EDIT,
            dataId: data.id,
            activityDetail: `{"Previous values": ${
              prev ? JSON.stringify(getDifference(data, prev)) : 'User edited'
            }}`,
            securityRelated: true,
            subjectResource: null,
            subjectId: null
          })
        }
      }}
      mutationMode={constants.MUTATION_MODE}
      resource={constants.R_USERS}
      redirect={path}>
      <EditVal setPrev={setPrev} />
    </Edit>
  )
}

interface EditValType {
  setPrev: React.Dispatch<React.SetStateAction<User | undefined>>
}

const EditVal = ({ setPrev }: EditValType): React.ReactElement => {
  const { record } = useEditContext()
  console.log(record)
  setPrev(record)
  return <UserForm isEdit />
}

const users = {
  edit: UserEdit,
  list: UserList,
  show: UserShow
}

export default users
export { UserCreate }
