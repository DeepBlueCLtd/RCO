import React, { lazy } from 'react'
import {
  EditButton,
  Form,
  Loading,
  Show,
  TopToolbar,
  useRecordContext,
  useShowContext
} from 'react-admin'
import CoreForm from './ItemForm/CoreForm'
import * as constants from '../../constants'
import TopToolbarField from '../../components/TopToolbarField'
import SourceInput from '../../components/SourceInput'
import { Box, type SxProps, type Theme, Typography } from '@mui/material'
import FlexBox from '../../components/FlexBox'
import useCanAccess from '../../hooks/useCanAccess'
import FieldWithLabel from '../../components/FieldWithLabel'
import SourceField from '../../components/SourceField'

const AuditList = lazy(async () => await import('../audit/AuditList'))

const ShowForm = (): React.ReactElement => {
  const { record, isLoading } = useShowContext<Item>()
  if (isLoading !== undefined && isLoading) return <Loading />

  const filter =
    record?.id !== undefined
      ? { dataId: record.id, resource: constants.R_ITEMS }
      : undefined
  const pageTitle = 'View Item'
  return (
    <FlexBox>
      <Box component='fieldset' style={{ width: '550px', padding: '0 15px' }}>
        <legend>
          <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
            <constants.ICON_ITEM /> {pageTitle}
          </Typography>
        </legend>
        <Form>
          <SourceInput
            label=''
            source='createdBy'
            inputProps={{ disabled: true, label: 'Added by' }}
            reference={constants.R_USERS}
          />
          <CoreForm disabled />
        </Form>
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
  )
}

export default function ItemShow(): React.ReactElement {
  const { hasAccess } = useCanAccess()

  return (
    <Show
      resource={constants.R_ITEMS}
      actions={
        <TopToolbar>
          <TopToolbarField source='item_number' />
          <DispatchedAt />
          {hasAccess(constants.R_ITEMS, { write: true }) && <EditButton />}
        </TopToolbar>
      }>
      <ShowForm />
    </Show>
  )
}

function DispatchedAt(): React.ReactElement {
  const { dispatched } = useRecordContext<Item>()

  const dispatchedAtSx: SxProps<Theme> = (theme: Theme) => ({
    fontSize: '30px',
    color: theme.palette.primary.main,
    '& span': { fontSize: '25px' }
  })

  if (typeof dispatched === 'undefined') return <></>

  return (
    <TopToolbarField<Item> source='dispatched' component='div'>
      <FieldWithLabel
        label='Dispatched at'
        source='dispatchedAt'
        link='show'
        component={() => (
          <SourceField
            link='show'
            source='dispatched'
            reference={constants.R_DISPATCH}
            sourceField='dispatchedAt'
          />
        )}
        labelStyles={dispatchedAtSx}
      />
    </TopToolbarField>
  )
}
