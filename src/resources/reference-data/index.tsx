import React from 'react'
import { Create, Edit } from 'react-admin'
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

  return (
    <Edit
      mutationMode={constants.MUTATION_MODE}
      redirect={`/${cName}`}
      resource={cName}>
      <ReferenceDataForm isEdit name={cName} />
    </Edit>
  )
}
export default RerferenceDataCreate
