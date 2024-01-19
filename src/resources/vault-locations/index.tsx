import React from 'react'
import { Create, Edit, useRedirect } from 'react-admin'
import VaultLocationForm from './VaultLocationForm'
import VaultLocationList from './VaultLocationList'
import ReferenceDataShow from '../reference-data/ReferenceDataShow'
import { R_VAULT_LOCATION } from '../../constants'
import * as constants from '../../constants'
const VaultLocationCreate = (): React.ReactElement => {
  return (
    <Create>
      <VaultLocationForm />
    </Create>
  )
}

export const VaultLocationEdit = (): React.ReactElement => {
  const redirect = useRedirect()
  return (
    <Edit
      mutationMode={constants.MUTATION_MODE}
      mutationOptions={{
        onSuccess: (data: { vaultNumber: string; id: number }): void => {
          redirect(`/${constants.R_VAULT_LOCATION}/${data?.id}/show`)
        }
      }}>
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
