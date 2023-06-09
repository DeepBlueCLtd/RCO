import React from 'react'
import { Create, Edit } from 'react-admin'
import VaultLocationForm from './VaultLocationForm'
import VaultLocationList from './VaultLocationList'
import ReferenceDataShow from '../reference-data/ReferenceDataShow'
import { R_VAULT_LOCATION } from '../../constants'

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

const VaultLocationShow = (): React.ReactElement => {
  return <ReferenceDataShow name={R_VAULT_LOCATION} />
}

const vaultLocations: ResourceRoutes = {
  create: VaultLocationCreate,
  edit: VaultLocationEdit,
  list: VaultLocationList,
  show: VaultLocationShow
}

export default vaultLocations
