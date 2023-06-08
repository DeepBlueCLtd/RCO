import React from 'react'
import { Create, Edit, useNotify, useRedirect } from 'react-admin'

const DispatchList = React.lazy(async () => await import('./DispatchList'))
const DispatchForm = React.lazy(async () => await import('./DispatchForm'))
const DispatchShow = React.lazy(async () => await import('./DispatchShow'))

const DispatchCreate = (): React.ReactElement => {
  const redirect = useRedirect()
  const notify = useNotify()

  return (
    <Create
      mutationOptions={{
        onSuccess: (data: Dispatch) => {
          notify('“Please add items” from Items page')
          redirect(`/dispatch/${data.id}`)
        }
      }}>
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

const dispatch: ResourceRoutes = {
  create: DispatchCreate,
  edit: DispatchEdit,
  list: DispatchList,
  show: DispatchShow
}

export default dispatch
