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
import BatchNumber from '../../components/BatchNumber'
import * as constants from '../../constants'

export default function ItemShow(): React.ReactElement {
  return (
    <Show
      resource={constants.R_ITEMS}
      actions={
        <TopToolbar>
          <BatchNumber />
          <EditButton />
        </TopToolbar>
      }>
      <Form>
        <TabbedShowLayout>
          <TabbedShowLayout.Tab label='Core'>
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
