import React, { useEffect, useState } from 'react'
import {
  BooleanInput,
  NumberInput,
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
import { useFormContext } from 'react-hook-form'

const schema = yup.object({
  name: yup.string().required()
})

export default function ReferenceDataForm(
  props: FormProps
): React.ReactElement {
  const { isEdit, name } = props
  const [isValid, setIsValid] = useState<boolean>(false)

  const defaultValues = {
    name: '',
    active: true
  }

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
      <EditToolBar type='button' onClick={createRecord} isValid={isValid} />
    )
  }

  return (
    <SimpleForm
      toolbar={<ReferenceToolbar isEdit={isEdit} />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <FormContent name={name} isEdit={isEdit} setIsValid={setIsValid} />
    </SimpleForm>
  )
}

type FormContentType = FormProps & {
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>
}

const FormContent = ({
  name,
  isEdit,
  setIsValid
}: FormContentType): React.ReactElement => {
  const {
    formState: { isValid }
  } = useFormContext()

  const isNotActive = (name: string): boolean => name === constants.R_AUDIT

  useEffect(() => {
    setIsValid(isValid)
  }, [isValid])

  return (
    <>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      {name === constants.R_MEDIA_TYPE ? (
        <NumberInput
          source='itemSize'
          sx={{ width: '100%', visibility: 'hidden' }}
          defaultValue={10}
        />
      ) : null}
      {isEdit !== undefined && name !== undefined && !isNotActive(name) ? (
        <BooleanInput defaultValue={true} source='active' />
      ) : (
        ''
      )}
    </>
  )
}
