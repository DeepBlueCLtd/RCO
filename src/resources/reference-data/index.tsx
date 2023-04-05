import React from 'react'
import { Create, Edit } from 'react-admin'
import ReferenceDataForm from '../../components/ReferenceDataForm'

const RerferenceDataCreate = ({
  name
}: {
  name: string
}): React.ReactElement => {
  const cName: string = name
  return (
    <Create redirect={`/reference-data/${cName}`}>
      <ReferenceDataForm />
    </Create>
  )
}

export const ReferenceDataEdit = ({
  name
}: {
  name: string
}): React.ReactElement => {
  const cName: string = name

  return (
    <Edit redirect={`/reference-data/${cName}`}>
      <ReferenceDataForm />
    </Edit>
  )
}
export default RerferenceDataCreate
