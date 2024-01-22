import React, { useEffect, useState } from 'react'
import {
  BooleanInput,
  NumberInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useNotify,
  useRecordContext,
  useUpdate
} from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import EditToolBar from '../../components/EditToolBar'
import * as constants from '../../constants'
import useCustomid from '../../hooks/useCustomId'
import { useFormContext } from 'react-hook-form'
import FlexBox from '../../components/FlexBox'
import { Typography } from '@mui/material'

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
    isEdit,
    name
  }: {
    isEdit?: boolean
    name?: string
  }): React.ReactElement => {
    const createRecord = useCustomid()
    const record = useRecordContext()
    const { getValues } = useFormContext()
    const notify = useNotify()
    const [update] = useUpdate()

    const onSave = (): void => {
      const values = getValues()
      const data = { ...values }
      update(constants.R_DEPARTMENT, {
        id: record.id,
        data,
        previousData: record
      }).catch((error) => {
        console.log(error)
        notify(
          'Can\'t change it because it is used as a foreign key in another table. ',
          {
            type: 'error'
          }
        )
      })
    }

    return isEdit ? (
      <Toolbar>
        {name === constants.R_DEPARTMENT ? (
          <SaveButton onClick={onSave} />
        ) : (
          <SaveButton />
        )}
      </Toolbar>
    ) : (
      <EditToolBar type='button' onClick={createRecord} isValid={isValid} />
    )
  }

  return (
    <SimpleForm
      toolbar={<ReferenceToolbar isEdit={isEdit} name={name} />}
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

  const warningTextForId =
    'Warning: Editing the id of a Department that is in use may lead to data corruption.  The id of a department must not be modified if data has been assigned to that department.'

  return (
    <>
      {name === constants.R_DEPARTMENT && isEdit && (
        <FlexBox justifyContent='end'>
          <TextInput source='id' variant='outlined' sx={{ width: '100%' }} />
          <Typography
            sx={{ fontWeight: '300', fontSize: '16px', color: 'red' }}>
            {warningTextForId}
          </Typography>
        </FlexBox>
      )}
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      {name === constants.R_MEDIA_TYPE ? (
        <NumberInput
          source='itemSize'
          sx={{ width: '100%', visibility: 'show' }}
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
