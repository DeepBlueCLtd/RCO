import React from 'react'
import { Form, Show, TabbedShowLayout } from 'react-admin'
import { Album, GroupWork, MenuBook } from '@mui/icons-material'
import CoreForm from './ItemForm/CoreForm'
import MediaForm from './ItemForm/MediaForm'

export default function ItemShow(): React.ReactElement {
  return (
    <Show>
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
