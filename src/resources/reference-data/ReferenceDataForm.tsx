import React, { useEffect, useState } from 'react'
import {
  BooleanInput,
  Button,
  NumberInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useNotify,
  useRecordContext,
  useRedirect,
  useUpdate
} from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import EditToolBar from '../../components/EditToolBar'
import * as constants from '../../constants'
import useCustomid from '../../hooks/useCustomId'
import { useFormContext } from 'react-hook-form'
import FlexBox from '../../components/FlexBox'
import { Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'

const schema = yup.object({
  name: yup.string().required()
})
interface Props {
  handleClose: () => void
  name?: string
}
const ChangeId = ({ handleClose, name }: Props): React.ReactElement => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  }
  const record = useRecordContext()
  const { getValues } = useFormContext()
  const notify = useNotify()
  const [update] = useUpdate()
  const values = getValues()
  const redirect = useRedirect()

  const onSave = (): void => {
    const resourcesWithListPage = [
      constants.R_CAT_CAVE,
      constants.R_CAT_CODE,
      constants.R_CAT_HANDLE,
      constants.R_DEPARTMENT
    ]
    const data = { ...values }
    const validName = name ?? ''
    update(validName, {
      id: record.id,
      data,
      previousData: record
    })
      .then(() => {
        const hasListPage = resourcesWithListPage.includes(validName)
        redirect(hasListPage ? `/${name}` : `/${name}/${data.id}/show`)
      })
      .catch((error) => {
        console.error(error)
        notify('Changing the id of a row may cause an element does not exist', {
          type: 'error'
        })
      })
  }

  return (
    <Box sx={style}>
      <Typography variant='h6'>
        Changing the Id of a row that is in use in VAL may silently fail. Please
        check the displayed value.
      </Typography>
      <FlexBox marginTop='20px' justifyContent='center'>
        <Button
          variant='contained'
          onClick={onSave}
          style={{ padding: '5px 15px', fontSize: '16px' }}>
          <Typography>Confirm</Typography>
        </Button>
        <Button
          variant='outlined'
          color='secondary'
          onClick={handleClose}
          style={{ padding: '5px 15px', fontSize: '16px' }}>
          <Typography>Cancel</Typography>
        </Button>
      </FlexBox>
    </Box>
  )
}
interface Props {
  handleClose: () => void
  name?: string
  isconfirm?: boolean
}
const PopUpId = ({
  handleClose,
  name,
  isconfirm
}: Props): React.ReactElement => {
  return (
    <Modal open={!!isconfirm} onClose={handleClose}>
      <div>
        <ChangeId handleClose={handleClose} name={name} />
      </div>
    </Modal>
  )
}

export default function ReferenceDataForm(
  props: FormProps
): React.ReactElement {
  const { isEdit, name } = props
  const [isValid, setIsValid] = useState<boolean>(false)
  const [isconfirm, setIsConfirm] = useState<boolean>(false)
  const [isIDChanged, setIsIDChanged] = useState<boolean>(false)

  const openConfirmationBox = (): void => {
    setIsConfirm(true)
  }

  const closeConfirmationBox = (): void => {
    setIsConfirm(false)
  }

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
    const validName = name ?? ''
    const resourcesWithListPage = [
      constants.R_DEPARTMENT,
      constants.R_CAT_CODE,
      constants.R_CAT_CAVE,
      constants.R_CAT_HANDLE
    ]
    return isEdit ? (
      <Toolbar>
        {resourcesWithListPage.includes(validName) && isIDChanged ? (
          <SaveButton onClick={openConfirmationBox} />
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
      <FormContent
        name={name}
        isEdit={isEdit}
        setIsValid={setIsValid}
        setIsIDChanged={setIsIDChanged}
      />
      <PopUpId
        handleClose={closeConfirmationBox}
        name={name}
        isconfirm={isconfirm}
      />
    </SimpleForm>
  )
}

type FormContentType = FormProps & {
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>
  setIsIDChanged: React.Dispatch<React.SetStateAction<boolean>>
}

const FormContent = ({
  name,
  isEdit,
  setIsValid,
  setIsIDChanged
}: FormContentType): React.ReactElement => {
  const {
    formState: { isValid, dirtyFields }
  } = useFormContext()
  const isNotActive = (name: string): boolean => name === constants.R_AUDIT

  useEffect(() => {
    setIsValid(isValid)
  }, [isValid])

  useEffect(() => {
    if (dirtyFields.id !== undefined && dirtyFields.id === true) {
      setIsIDChanged(true)
    }
  }, [{ ...dirtyFields }])
  const validName = name ?? ''
  const resourceForEditId = [
    constants.R_CAT_CODE,
    constants.R_CAT_CAVE,
    constants.R_CAT_HANDLE,
    constants.R_DEPARTMENT
  ]

  const resourceName =
    name === constants.R_DEPARTMENT
      ? 'department'
      : name === constants.R_CAT_CODE
      ? 'code'
      : name === constants.R_CAT_CAVE
      ? 'cave'
      : name === constants.R_CAT_HANDLE
      ? 'handle'
      : 'resource'
  const warningTextForId = `Warning: Editing the id of a ${resourceName} that is in use may lead to data corruption.  The id of a ${resourceName} must not be modified if data has been assigned to that ${resourceName}.`

  return (
    <>
      {resourceForEditId.includes(validName) && isEdit && (
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
