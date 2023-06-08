import React from 'react'
import { Create, Edit, Show } from 'react-admin'

const AddressList = React.lazy(async () => await import('./AddressList'))
const AddressForm = React.lazy(async () => await import('./AddressForm'))

const AddressCreate = (): React.ReactElement => {
  return (
    <Create>
      <AddressForm />
    </Create>
  )
}

export const AddressEdit = (): React.ReactElement => {
  return (
    <Edit>
      <AddressForm />
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
