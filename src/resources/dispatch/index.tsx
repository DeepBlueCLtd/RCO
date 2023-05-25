import React from 'react'
import { Create, Edit, EditButton, Show, TopToolbar } from 'react-admin'
import useCanAccess from '../../hooks/useCanAccess'
import * as constants from '../../constants'
import TopToolbarField from '../../components/TopToolbarField'

const DispatchList = React.lazy(async () => await import('./DispatchList'))
const DispatchForm = React.lazy(async () => await import('./DispatchForm'))

const ShowActions = (): React.ReactElement => {
  const { hasAccess } = useCanAccess()
  return (
    <>
      <TopToolbar>
        <TopToolbarField<Dispatch> source='reference' />
        {hasAccess(constants.R_DISPATCH, { write: true }) && <EditButton />}
      </TopToolbar>
    </>
  )
}

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
    <Show actions={<ShowActions />}>
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
