import React, { useState } from 'react'
import {
  Button,
  Datagrid,
  DateField,
  List,
  Show,
  SimpleShowLayout,
  TextField
} from 'react-admin'
import { Box, Modal } from '@mui/material'
import { R_ITEMS } from '../../constants'
import SourceField from '../../components/SourceField'
import FlexBox from '../../components/FlexBox'
import DestroyItems from '../items/DestroyItems'
import { useParams } from 'react-router-dom'

export default function DestructionShow(): React.ReactElement {
  const [open, setOpen] = useState(false)
  const { id = '' } = useParams()

  const onClose = (): void => {
    setOpen(false)
  }

  return (
    <Box>
      <Show>
        <SimpleShowLayout>
          <TextField source='reference' />
          <DateField source='finalisedAt' />
        </SimpleShowLayout>
      </Show>
      <Box marginTop={3} marginBottom={3}>
        <List actions={false} resource={R_ITEMS}>
          <Datagrid bulkActionButtons={<></>}>
            <TextField source='item_number' label='Reference' />
            <TextField source='mediaType' label='Media type' />
            <TextField source='consecPages' label='ConsecSerial' />
            <SourceField
              source='protectiveMarking'
              reference='protectiveMarking'
            />
          </Datagrid>
          <Modal open={open} onClose={onClose}>
            <DestroyItems
              destructionId={id}
              successCallback={onClose}
              onClose={onClose}
            />
          </Modal>
        </List>
      </Box>
      <FlexBox justifyContent='flex-end'>
        <Button variant='outlined' size='large' label='Report' />
        <Button
          variant='contained'
          size='large'
          onClick={() => { setOpen(true) }}
          label='Destroy'
        />
      </FlexBox>
    </Box>
  )
}
