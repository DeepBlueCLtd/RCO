import React from 'react'
import { Create, Edit } from 'react-admin'
import ReferenceDataForm from './ReferenceDataForm'

interface PropType {
  name: string
}

const RerferenceDataCreate = ({ name }: PropType): React.ReactElement => {
  const cName: string = name
  return (
    <Create redirect={`/reference-data/${cName}`}>
      <ReferenceDataForm />
    </Create>
  )
}

export const ReferenceDataEdit = ({ name }: PropType): React.ReactElement => {
  const cName: string = name
  return (
    <Edit redirect={`/reference-data/${cName}`}>
      <ReferenceDataForm isEdit name={cName} />
    </Edit>
  )
}
export default RerferenceDataCreate
