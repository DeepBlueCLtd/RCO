import React from 'react'
import {
  BooleanInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar
} from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import EditToolBar from '../../components/EditToolBar'
import * as constants from '../../constants'
import useCustomid from '../../hooks/useCustomId'

const schema = yup.object({
  name: yup.string().required()
})

export default function ReferenceDataForm(
  props: FormProps
): React.ReactElement {
  const { isEdit, name } = props
  const defaultValues = {
    name: '',
    active: true
  }

  const isNotActive = (name: string): boolean => name === constants.R_AUDIT

  const ReferenceToolbar = ({
    isEdit
  }: {
    isEdit?: boolean
  }): React.ReactElement => {
    const createRecord = useCustomid()
    return isEdit ? (
      <Toolbar>
        <SaveButton />
      </Toolbar>
    ) : (
      <EditToolBar type='button' onClick={createRecord} />
    )
  }

  return (
    <SimpleForm
      toolbar={<ReferenceToolbar isEdit={isEdit} />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      {isEdit !== undefined && name !== undefined && !isNotActive(name) ? (
        <BooleanInput defaultValue={true} source='active' />
      ) : (
        ''
      )}
    </SimpleForm>
  )
}
