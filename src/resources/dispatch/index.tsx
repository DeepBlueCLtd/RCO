import React from 'react'
import { Create, Edit, Show } from 'react-admin'

const DispatchList = React.lazy(async () => await import('./DispatchList'))
const DispatchForm = React.lazy(async () => await import('./DispatchForm'))

const DispatchCreate = (): React.ReactElement => {
  return (
    <Create>
      <DispatchForm />
    </Create>
  )
}

export const DispatchEdit = (): React.ReactElement => {
  return (
    <Edit>
      <DispatchForm />
    </Edit>
  )
}

export const DispatchShow = (): React.ReactElement => {
  return (
    <Show>
      <DispatchForm show />
    </Show>
  )
}

const dispatch: ResourceRoutes = {
  create: DispatchCreate,
  edit: DispatchEdit,
  list: DispatchList,
  show: DispatchShow
}

export default dispatch
