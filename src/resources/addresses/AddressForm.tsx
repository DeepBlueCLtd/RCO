import { BooleanInput, DateInput, SimpleForm, TextInput } from 'react-admin'
import { R_ADDRESSES } from '../../constants'
import { DateTime } from 'luxon'
import React from 'react'
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

  const defaultValues: Partial<Address> = {
    createdAt: DateTime.now().toISO() ?? undefined,
    active: true
  }
  const showForm = typeof show !== 'undefined' && show

  return (
    <SimpleForm
      defaultValues={defaultValues}
      resource={R_ADDRESSES}
      toolbar={isEdit ?? create ? <EditToolBar /> : false}>
      <Typography variant='h6' fontWeight='bold'>
        {isEdit ? 'Edit Address' : show ? 'View Address' : 'Add new Address'}
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
