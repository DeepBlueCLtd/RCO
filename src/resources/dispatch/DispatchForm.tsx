import {
  DateInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar
} from 'react-admin'
import React from 'react'
import SourceInput from '../../components/SourceInput'
import { R_ADDRESSES, R_USERS, R_VAULT } from '../../constants'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FlexBox from '../../components/FlexBox'
import { ConditionalReferenceInput } from '../batches/BatchForm'

interface Props {
  show?: boolean
}

const sx = { width: '100%' }

const schema = yup.object({
  toAddress: yup.number().required(),
  remarks: yup.string(),
  toName: yup.string().required()
})

const EditToolbar = (): React.ReactElement => {
  return (
    <Toolbar>
      <SaveButton />
    </Toolbar>
  )
}

export default function DispatchForm(props: Props): React.ReactElement {
  const { show } = props

  const showForm = typeof show !== 'undefined' && show

  return (
    <SimpleForm
      toolbar={showForm ? false : <EditToolbar />}
      resolver={yupResolver(schema)}>
      <FlexBox flexDirection={showForm ? 'row' : 'column'}>
        <TextInput sx={sx} disabled={show} source='toName' />
      </FlexBox>
      <FlexBox flexDirection={showForm ? 'row' : 'column'}>
        <SourceInput
          source='toAddress'
          filter={{ active: true }}
          reference={R_ADDRESSES}
          optionField='fullAddress'
          inputProps={{
            disabled: showForm
          }}
        />
      </FlexBox>
      {showForm && (
        <>
          <FlexBox>
            <TextInput sx={sx} disabled source='name' />
            <SourceInput
              sx={sx}
              disabled
              source='createdBy'
              reference={R_USERS}
              inputProps={{
                disabled: true
              }}
            />
          </FlexBox>
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
      <ConditionalReferenceInput
        source='vault'
        reference={R_VAULT}
        inputProps={{ helperText: false }}
        active
      />
      <TextInput sx={sx} disabled={show} multiline source='remarks' />
    </SimpleForm>
  )
}
