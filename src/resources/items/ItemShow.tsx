import React, { lazy } from 'react'
import {
  EditButton,
  Form,
  Loading,
  Show,
  TabbedShowLayout,
  TopToolbar,
  useShowContext
} from 'react-admin'
import { Album, GroupWork, MenuBook, History } from '@mui/icons-material'
import CoreForm from './ItemForm/CoreForm'
import MediaForm from './ItemForm/MediaForm'
import * as constants from '../../constants'
import TopToolbarField from '../../components/TopToolbarField'
import SourceInput from '../../components/SourceInput'

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
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label='Core'>
          <SourceInput
            label=''
            source='createdBy'
            inputProps={{ disabled: true, label: 'Added by' }}
            reference={constants.R_USERS}
          />
          <CoreForm disabled />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab
          label='Mag tape'
          icon={<GroupWork />}
          iconPosition='end'>
          <MediaForm disabled type='Tape' source='magTape' />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label='DVD' icon={<Album />} iconPosition='end'>
          <MediaForm disabled type='DVD' source='dvd' />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab
          label='Paper'
          icon={<MenuBook />}
          iconPosition='end'>
          <MediaForm disabled type='Paper' source='paper' />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab
          label='History'
          icon={<History />}
          iconPosition='end'>
          <AuditList filter={filter} />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
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
