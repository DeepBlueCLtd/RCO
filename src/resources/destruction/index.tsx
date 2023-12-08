import React from 'react'
import { Create, Edit } from 'react-admin'
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
  return (
    <Edit mutationMode={constants.MUTATION_MODE}>
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
