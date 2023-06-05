import { DateInput, SimpleForm, TextInput } from 'react-admin'
import React from 'react'
import SourceInput from '../../components/SourceInput'
import { R_ADDRESSES, R_USERS } from '../../constants'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FlexBox from '../../components/FlexBox'

interface Props {
  show?: boolean
}

const sx = { width: '100%' }

const schema = yup.object({
  toAddress: yup.number().required(),
  remarks: yup.string().required(),
  toName: yup.string().required()
})

export default function DispatchForm(props: Props): React.ReactElement {
  const { show } = props

  const showForm = typeof show !== 'undefined' && show

  return (
    <SimpleForm
      toolbar={showForm ? false : undefined}
      resolver={yupResolver(schema)}>
      <TextInput sx={sx} disabled={show} source='toName' />
      <SourceInput
        source='toAddress'
        filter={{ active: true }}
        reference={R_ADDRESSES}
        optionField='fullAddress'
      />
      {showForm && (
        <>
          <TextInput sx={sx} disabled source='reference' />
          <SourceInput
            sx={sx}
            disabled
            source='createdBy'
            reference={R_USERS}
          />
          <FlexBox>
            <DateInput sx={sx} disabled source='createdAt' />
            <DateInput sx={sx} disabled source='lastHastenerSent' />
          </FlexBox>
          <FlexBox>
            <DateInput sx={sx} disabled source='receiptReceived' />
            <DateInput sx={sx} disabled source='dispatchedAt' />
          </FlexBox>
        </>
      )}
      <TextInput sx={sx} disabled={show} multiline source='remarks' />
    </SimpleForm>
  )
}
