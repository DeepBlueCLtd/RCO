import React from 'react'
import { Create, Edit, useRedirect } from 'react-admin'
import ReferenceDataForm from './ReferenceDataForm'
import * as constants from '../../constants'

interface PropType {
  name: string
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
