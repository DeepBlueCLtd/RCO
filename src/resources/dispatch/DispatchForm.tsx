import {
  DateInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useDataProvider,
  useRedirect
} from 'react-admin'
import React, { useEffect } from 'react'
import SourceInput from '../../components/SourceInput'
import { R_ADDRESSES, R_DISPATCH, R_USERS, R_VAULT } from '../../constants'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FlexBox from '../../components/FlexBox'
import { ConditionalReferenceInput } from '../batches/BatchForm'
import { useParams } from 'react-router-dom'

interface Props {
  show?: boolean
  edit?: boolean
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
  const { show, edit } = props

  const { id } = useParams()
  const dataProvider = useDataProvider()
  const redirect = useRedirect()

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (id !== undefined) {
        const {
          data: { dispatchedAt }
        } = await dataProvider.getOne<Dispatch>(R_DISPATCH, { id: Number(id) })
        if (dispatchedAt && dispatchedAt !== 'null' && edit) {
          redirect(`/dispatch/${id}/show`)
        }
      }
    }
    fetchData().catch(console.log)
  }, [id])

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
        show={show}
        {...(edit ? { active: true } : null)}
      />
      <TextInput sx={sx} disabled={show} multiline source='remarks' />
    </SimpleForm>
  )
}
