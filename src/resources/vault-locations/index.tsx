import React from 'react'
import { Create, Edit } from 'react-admin'
import VaultLocationForm from './VaultLocationForm'
import VaultLocationList from './VaultLocationList'

const VaultLocationCreate = (): React.ReactElement => {
  return (
    <Create>
      <VaultLocationForm />
    </Create>
  )
}

export const VaultLocationEdit = (): React.ReactElement => {
  return (
    <Edit>
      <VaultLocationForm />
    </Edit>
  )
}

const vaultLocations: ResourceRoutes = {
  create: VaultLocationCreate,
  edit: VaultLocationEdit,
  list: VaultLocationList
}

export default vaultLocations
