import { BooleanInput, DateInput, SimpleForm, TextInput } from 'react-admin'
import { R_ADDRESSES } from '../../constants'
import { DateTime } from 'luxon'
import React, { useMemo } from 'react'
import EditToolBar from '../../components/EditToolBar'
import { Typography } from '@mui/material'

interface Props {
  show?: boolean
  isEdit?: boolean
  create?: boolean
}

const sx = { width: '100%' }

export default function AddressForm(props: Props): React.ReactElement {
  const { show, isEdit, create } = props

  // built once: a new object on each render (createdAt changes every time)
  // made react-admin reset the form, wiping what the user had typed
  const defaultValues: Partial<Address> = useMemo(
    () => ({
      createdAt: DateTime.now().toISO() ?? undefined,
      active: true
    }),
    []
  )
  const showForm = typeof show !== 'undefined' && show
  const formTitle = isEdit
    ? 'Edit Address'
    : show
    ? 'View Address'
    : 'Add new Address'
  return (
    <SimpleForm
      defaultValues={defaultValues}
      resource={R_ADDRESSES}
      toolbar={isEdit ?? create ? <EditToolBar /> : false}>
      <Typography variant='h6' fontWeight='bold'>
        {formTitle}
      </Typography>
      <TextInput sx={sx} disabled={show} multiline source='fullAddress' />
      <BooleanInput disabled={show} defaultValue={true} source='active' />
      {showForm && (
        <DateInput sx={sx} disabled={show} multiline source='createdAt' />
      )}
      <TextInput sx={sx} disabled={show} multiline source='remarks' />
    </SimpleForm>
  )
}
