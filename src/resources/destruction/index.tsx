import React from 'react'
import { Create, Edit, useRedirect } from 'react-admin'
import DestructionForm from './DestructionForm'
import * as constants from '../../constants'

const DestructionList = React.lazy(
  async () => await import('./DestructionList')
)
const DestructionShow = React.lazy(
  async () => await import('./DestructionShow')
)

const DestructionCreate = (): React.ReactElement => {
  return (
    <Create>
      <DestructionForm />
    </Create>
  )
}

const DestructionEdit = (): React.ReactElement => {
  const redirect = useRedirect()
  return (
    <Edit
      mutationMode={constants.MUTATION_MODE}
      mutationOptions={{
        onSuccess: (data: { destructionNumber: string; id: number }): void => {
          redirect(`/${constants.R_DESTRUCTION}/${data?.id}/show`)
        }
      }}>
      <DestructionForm disabledFields={['year', 'name']} isEdit />
    </Edit>
  )
}

const destruction: ResourceRoutes = {
  create: DestructionCreate,
  edit: DestructionEdit,
  list: DestructionList,
  show: DestructionShow
}

export default destruction
