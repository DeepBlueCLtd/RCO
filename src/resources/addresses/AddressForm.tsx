import { BooleanInput, DateInput, SimpleForm, TextInput } from 'react-admin'
import { R_ADDRESSES } from '../../constants'
import { DateTime } from 'luxon'
import React from 'react'

interface Props {
  show?: boolean
}

const sx = { width: '100%' }

export default function AddressForm(props: Props): React.ReactElement {
  const { show } = props

  const defaultValues: Partial<Address> = {
    createdAt: DateTime.now().toISO() ?? undefined
  }
  const showForm = typeof show !== 'undefined' && show

  return (
    <SimpleForm
      defaultValues={defaultValues}
      resource={R_ADDRESSES}
      toolbar={showForm ? false : undefined}>
      <TextInput sx={sx} disabled={show} multiline source='fullAddress' />
      <BooleanInput disabled={show} defaultValue={true} source='active' />
      {showForm && (
        <DateInput sx={sx} disabled={show} multiline source='createdAt' />
      )}
      <TextInput sx={sx} disabled={show} multiline source='remarks' />
    </SimpleForm>
  )
}
