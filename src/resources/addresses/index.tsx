import React from 'react'
import { Create, Edit, Show, useRedirect } from 'react-admin'
import * as constants from '../../constants'
const AddressList = React.lazy(async () => await import('./AddressList'))
const AddressForm = React.lazy(async () => await import('./AddressForm'))

const AddressCreate = (): React.ReactElement => {
  return (
    <Create>
      <AddressForm create />
    </Create>
  )
}

export const AddressEdit = (): React.ReactElement => {
  const redirect = useRedirect()
  return (
    <Edit
      mutationMode={constants.MUTATION_MODE}
      mutationOptions={{
        onSuccess: (data: { addressNumber: string; id: number }): void => {
          redirect(`/${constants.R_ADDRESSES}/${data?.id}/show`)
        }
      }}>
      <AddressForm isEdit />
    </Edit>
  )
}

export const AddressShow = (): React.ReactElement => {
  return (
    <Show>
      <AddressForm show />
    </Show>
  )
}

const addresses: ResourceRoutes = {
  create: AddressCreate,
  edit: AddressEdit,
  list: AddressList,
  show: AddressShow
}

export default addresses
