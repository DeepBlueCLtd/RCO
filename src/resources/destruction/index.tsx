import React from 'react'
import { Create } from 'react-admin'
import DestructionForm from './DestructionForm'

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

const destruction: ResourceRoutes = {
  create: DestructionCreate,
  list: DestructionList,
  show: DestructionShow
}

export default destruction
