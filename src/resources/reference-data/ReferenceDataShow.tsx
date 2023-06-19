import { Card, CardContent, IconButton, Typography } from '@mui/material'
import {
  BooleanField,
  EditButton,
  Show,
  TextField,
  TopToolbar,
  useShowContext
} from 'react-admin'
import { ValueField } from '../projects/ProjectShow'
import ResourceHistoryModal from '../../components/ResourceHistory'
import { type HistoryProps } from '../batches/BatchShow'
import { type ResourceTypes } from '../../constants'
import { useState } from 'react'
import { History } from '@mui/icons-material'
import useCanAccess from '../../hooks/useCanAccess'

const HistoryModal = ({
  handleOpen,
  open,
  resource
}: HistoryProps & { resource: ResourceTypes }): React.ReactElement => {
  const { record } = useShowContext<Batch>()
  if (record === undefined) return <></>
  const filter = { dataId: record.id, resource }
  return (
    <ResourceHistoryModal
      open={open}
      close={() => {
        handleOpen(false)
      }}
      filter={filter}
    />
  )
}

interface ShowActionProps {
  handleOpen: (open: boolean) => void
  resource: ResourceTypes
}

const Actions = ({
  handleOpen,
  resource
}: ShowActionProps): React.ReactElement => {
  const { hasAccess } = useCanAccess()

  return (
    <TopToolbar sx={{ alignItems: 'center' }}>
      <IconButton
        onClick={() => {
          handleOpen(true)
        }}>
        <History />
      </IconButton>
      {hasAccess(resource, { write: true }) ? <EditButton /> : null}
    </TopToolbar>
  )
}

interface PropType {
  name: string
}

export default function ReferenceDataShow({
  name
}: PropType): React.ReactElement {
  const cName: ResourceTypes = name as ResourceTypes
  const [open, setOpen] = useState(false)

  const handleOpen = (open: boolean): void => {
    setOpen(open)
  }
  return (
    <Show
      resource={name}
      actions={<Actions handleOpen={handleOpen} resource={cName} />}>
      <Typography variant='h5' fontWeight='bold' sx={{ padding: '15px' }}>
        {`View ${name}`}
      </Typography>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <ValueField label='Id'>
            <TextField variant='h6' source='id' />
          </ValueField>
          <ValueField label='name'>
            <TextField variant='h6' source='name' />
          </ValueField>
          <ValueField label='active'>
            <BooleanField source='active' />
          </ValueField>
        </CardContent>
      </Card>
      <HistoryModal handleOpen={handleOpen} open={open} resource={cName} />
    </Show>
  )
}
