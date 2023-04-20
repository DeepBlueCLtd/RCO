import React from 'react'
import { BooleanInput, SimpleForm, TextInput } from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import EditToolBar from '../../components/EditToolBar'

const schema = yup.object({
  name: yup.string().required()
})

export default function ReferenceDataForm(
  props: FormProps
): React.ReactElement {
  const { isEdit, name } = props
  const defaultValues = {
    name: ''
  }
  return (
    <SimpleForm
      toolbar={<EditToolBar isEdit={isEdit} />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      {isEdit !== undefined && name === 'department' ? (
        <BooleanInput source='active' />
      ) : (
        ''
      )}
    </SimpleForm>
  )
}
