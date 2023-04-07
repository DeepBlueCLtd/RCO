import React from 'react'
import { Create, Edit } from 'react-admin'
import BatchForm from './BatchForm'

const BatchList = React.lazy(async () => await import('./BatchList'))
const BatchShow = React.lazy(async () => await import('./BatchShow'))

const BatchCreate = (): React.ReactElement => {
  return (
    <Create>
      <BatchForm />
    </Create>
  )
}

const BatchEdit = (): React.ReactElement => {
  return (
    <Edit>
      <BatchForm isEdit />
    </Edit>
  )
}

const batches = {
  create: BatchCreate,
  edit: BatchEdit,
  list: BatchList,
  show: BatchShow
}

export default batches
