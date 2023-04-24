import React from 'react'
import {
  EditButton,
  Form,
  Show,
  TabbedShowLayout,
  TopToolbar
} from 'react-admin'
import { Album, GroupWork, MenuBook } from '@mui/icons-material'
import CoreForm from './ItemForm/CoreForm'
import MediaForm from './ItemForm/MediaForm'
import * as constants from '../../constants'
import TopToolbarField from '../../components/TopToolbarField'
import SourceInput from '../../components/SourceInput'

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
      <Form>
        <TabbedShowLayout>
          <TabbedShowLayout.Tab label='Core'>
            <SourceInput
              label=''
              source='createdBy'
              inputProps={{ disabled: true, label: 'User name' }}
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
        </TabbedShowLayout>
      </Form>
    </Show>
  )
}
