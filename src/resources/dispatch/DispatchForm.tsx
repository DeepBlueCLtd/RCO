import { DateInput, SimpleForm, TextInput } from 'react-admin'
import { DateTime } from 'luxon'
import React from 'react'
import SourceInput from '../../components/SourceInput'
import { R_ADDRESSES } from '../../constants'

interface Props {
  show?: boolean
}

const sx = { width: '100%' }

export default function DispatchForm(props: Props): React.ReactElement {
  const { show } = props

  const defaultValues: Partial<Address> = {
    createdAt: DateTime.now().toISO() ?? undefined
  }
  const showForm = typeof show !== 'undefined' && show

  return (
    <SimpleForm
      defaultValues={defaultValues}
      toolbar={showForm ? false : undefined}>
      <SourceInput
        source='toAddress'
        reference={R_ADDRESSES}
        optionField='fullAddress'
      />
      {showForm && (
        <DateInput sx={sx} disabled={show} multiline source='createdAt' />
      )}
      <TextInput sx={sx} disabled={show} multiline source='remarks' />
    </SimpleForm>
  )
}
