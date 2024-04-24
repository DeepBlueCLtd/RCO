import React, { useEffect, useState } from 'react'
import { Create, Edit, useEditContext, useRedirect } from 'react-admin'
import UserForm from './UserForm'
import * as constants from '../../constants'
import useAudit from '../../hooks/useAudit'
import { AuditType } from '../../utils/activity-types'
import { getDifference } from '../../providers/dataProvider/dataprovider-utils'

const UserList = React.lazy(async () => await import('./UserList'))
const UserShow = React.lazy(async () => await import('./UserShow'))

const UserCreate = (): React.ReactElement => {
  const redirect = useRedirect()
  return (
    <Create
      resource={constants.R_USERS}
      mutationOptions={{
        onSuccess: (data: { user: string; id: number }): void => {
          redirect(`/${constants.R_USERS}/${data?.id}/show`)
        }
      }}>
      <UserForm isEdit={false} />
    </Create>
  )
}

const UserEdit = (): React.ReactElement => {
  const audit = useAudit()
  const [prev, setPrev] = useState<_Users>()
  const redirect = useRedirect()
  return (
    <Edit
      mutationOptions={{
        onSuccess: async (data: _Users) => {
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
          redirect(`/${constants.R_USERS}/${data?.id}/show`)
        }
      }}
      mutationMode={constants.MUTATION_MODE}
      resource={constants.R_USERS}>
      <EditVal setPrev={setPrev} />
    </Edit>
  )
}

interface EditValType {
  setPrev: React.Dispatch<React.SetStateAction<_Users | undefined>>
}

const EditVal = ({ setPrev }: EditValType): React.ReactElement => {
  const { record } = useEditContext()

  useEffect(() => {
    setPrev(record as _Users)
  }, [record, setPrev])

  return <UserForm isEdit />
}

const users = {
  create: UserCreate,
  edit: UserEdit,
  list: UserList,
  show: UserShow
}

export default users
