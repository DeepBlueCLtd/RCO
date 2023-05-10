import React, { lazy } from 'react'
import {
  EditButton,
  Form,
  Loading,
  Show,
  TopToolbar,
  useShowContext
} from 'react-admin'
import CoreForm from './ItemForm/CoreForm'
import * as constants from '../../constants'
import TopToolbarField from '../../components/TopToolbarField'
import SourceInput from '../../components/SourceInput'
import FlexBox from '../../components/FlexBox'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'

const AuditList = lazy(async () => await import('../audit/AuditList'))

const ShowForm = (): React.ReactElement => {
  const { record, isLoading } = useShowContext<Item>()
  if (isLoading !== undefined && isLoading) return <Loading />

  const filter =
    record?.id !== undefined
      ? { data_id: record.id, resource: constants.R_ITEMS }
      : undefined

  return (
    <Form>
      <FlexBox>
        <Box component='fieldset' style={{ width: '550px', padding: '0 15px' }}>
          <legend>
            <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
              Detail
            </Typography>
          </legend>
          <SourceInput
            label=''
            source='createdBy'
            inputProps={{ disabled: true, label: 'Added by' }}
            reference={constants.R_USERS}
          />
          <CoreForm disabled />
        </Box>
        <Box component='fieldset' style={{ padding: '0 15px' }}>
          <legend>
            <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
              History
            </Typography>
          </legend>
          <AuditList filter={filter} />
        </Box>
      </FlexBox>
    </Form>
  )
}

export default function ItemShow(): React.ReactElement {
  return (
    <Show
      resource={constants.R_ITEMS}
      actions={
        <TopToolbar>
          <TopToolbarField source='item_number' />
          <EditButton />
        </TopToolbar>
      }>
      <ShowForm />
    </Show>
  )
}
