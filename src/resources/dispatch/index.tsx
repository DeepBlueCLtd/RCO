import React from 'react'
import { Create, Edit, useNotify, useRedirect } from 'react-admin'
import * as constants from '../../constants'

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
          notify('Please add items from Live Items page')
          redirect(`/${constants.R_DISPATCH}/${data.id}/show`)
        }
      }}>
      <DispatchForm />
    </Create>
  )
}

export const DispatchEdit = (): React.ReactElement => {
  const redirect = useRedirect()
  return (
    <Edit
      mutationMode={constants.MUTATION_MODE}
      mutationOptions={{
        onSuccess: (data: Dispatch) => {
          redirect(`/${constants.R_DISPATCH}/${data.id}/show`)
        }
      }}>
      <DispatchForm edit />
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
