import React from 'react'
import { Create, Edit, useRedirect } from 'react-admin'
import ReferenceDataForm from './ReferenceDataForm'
import * as constants from '../../constants'
import { useConfigData } from '../../utils/useConfigData'
interface PropType {
  name: string
}

export const getResourceName = (name: string): string => {
  const configData = useConfigData()
  const resourceNames = {
    [constants.R_DEPARTMENT]: 'Department',
    [constants.R_CAT_CODE]: configData?.catCode,
    [constants.R_CAT_CAVE]: configData?.catCave,
    [constants.R_CAT_HANDLE]: configData?.catHandle,
    [constants.R_ORGANISATION]: 'Organisation',
    [constants.R_PROTECTIVE_MARKING]: 'Protective Marking',
    [constants.R_MEDIA_TYPE]: 'Media type',
    [constants.R_VAULT]: 'Vault',
    [constants.R_PLATFORMS]: 'Platform',
    [constants.R_VAULT_LOCATION]: 'Vault Location'
  }

  return name !== undefined && name in resourceNames
    ? resourceNames[name as keyof typeof resourceNames] ?? 'resource'
    : name
}

const RerferenceDataCreate = ({ name }: PropType): React.ReactElement => {
  const cName: string = name
  return (
    <Create redirect={`/${cName}`} resource={cName}>
      <ReferenceDataForm name={cName} />
    </Create>
  )
}

export const ReferenceDataEdit = ({ name }: PropType): React.ReactElement => {
  const cName: string = name
  const redirect = useRedirect()

  return (
    <Edit
      mutationMode={constants.MUTATION_MODE}
      mutationOptions={{
        onSuccess: (data: { vaultNumber: string; id: number }): void => {
          if (cName === constants.R_DEPARTMENT) {
            redirect(`/${constants.R_DEPARTMENT}`)
          } else {
            redirect(`/${cName}/${data?.id}/show`)
          }
        }
      }}
      resource={cName}>
      <ReferenceDataForm isEdit name={cName} />
    </Edit>
  )
}
export default RerferenceDataCreate
