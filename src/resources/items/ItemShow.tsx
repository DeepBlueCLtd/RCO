import React, { useEffect, useMemo, useState } from 'react'
import {
  EditButton,
  Form,
  Link,
  Loading,
  Show,
  TopToolbar,
  useShowContext
} from 'react-admin'
import CoreForm from './ItemForm/CoreForm'
import * as constants from '../../constants'
import TopToolbarField from '../../components/TopToolbarField'
import SourceInput from '../../components/SourceInput'
import { Box, Typography, IconButton, type Theme } from '@mui/material'
import useCanAccess from '../../hooks/useCanAccess'
import SourceField from '../../components/SourceField'
import { History } from '@mui/icons-material'
import ResourceHistoryModal from '../../components/ResourceHistory'
import { type SystemStyleObject } from '@mui/system'

interface ShowFormProps {
  setRecord: React.Dispatch<React.SetStateAction<Item | undefined>>
}

const ShowForm = ({ setRecord }: ShowFormProps): React.ReactElement => {
  const { record, isLoading } = useShowContext<Item>()

  useEffect(() => {
    if (!isLoading) setRecord(record)
  }, [isLoading])

  if (isLoading !== undefined && isLoading) return <Loading />

  const pageTitle = 'View Item'

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant='h5' fontWeight='bold' sx={{ padding: '15px' }}>
        <constants.ICON_ITEM /> {pageTitle}
      </Typography>
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
  )
}

const sx = (theme: Theme): SystemStyleObject<Theme> => {
  const color: string = `${theme.palette.common.white} !important`

  return {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    background: theme.palette.primary.main,
    justifyContent: 'center',
    color,
    borderRadius: '5px'
  }
}
interface StatusTextProps {
  record: Item
}
const StatusText = ({ record }: StatusTextProps): React.ReactElement | null => {
  let linkPathname = ''
  let statusText = ''
  let source: keyof Item

  if (record.destruction !== undefined) {
    linkPathname = `/destruction/${record.destruction}/show`
    source = 'destruction'
    if (record.destructionDate !== undefined) {
      statusText = `Destroyed at: ${record.destructionDate}`
    } else {
      statusText = 'Pending Destruction'
    }
  } else if (record.dispatchJob !== undefined) {
    linkPathname = `/dispatch/${record.dispatchJob}/show`
    source = 'dispatchJob'
    if (record.dispatchedDate !== undefined) {
      statusText = `Dispatched at: ${record.dispatchedDate}`
    } else {
      statusText = 'Pending Dispatch'
    }
  } else if (record.loanedTo !== undefined) {
    source = 'loanedTo'
    statusText = 'Loaned to: '
  } else {
    return null
  }
  return source === 'loanedTo' ? (
    <TopToolbarField<Item> source={source} component='div'>
      <Typography sx={sx} variant='h5'>
        {statusText}
        <SourceField
          link='show'
          source={source}
          reference={constants.R_USERS}
          sourceField={source}
          textProps={{
            sx: {
              color: 'white !important',
              fontWeight: 'bold',
              marginLeft: '5px'
            }
          }}
        />
      </Typography>
    </TopToolbarField>
  ) : (
    <TopToolbarField<Item> source={source} component='div'>
      <Link to={{ pathname: linkPathname }}>
        <Typography variant='h5' sx={sx}>
          {statusText}
        </Typography>
      </Link>
    </TopToolbarField>
  )
}

interface ItemShowProps {
  handleOpen: (open: boolean) => void
  record: Item
}

const ItemShowActions = ({
  handleOpen,
  record
}: ItemShowProps): React.ReactElement => {
  const { hasAccess } = useCanAccess()

  return (
    <TopToolbar sx={{ alignItems: 'center' }}>
      <TopToolbarField source='item_number' />
      <StatusText record={record} />
      {hasAccess(constants.R_ITEMS, { write: true }) && <EditButton />}
      <IconButton
        onClick={() => {
          handleOpen(true)
        }}>
        <History />
      </IconButton>
    </TopToolbar>
  )
}

export default function ItemShow(): React.ReactElement {
  const [open, setOpen] = useState(false)
  const [record, setRecord] = useState<Item | undefined>()

  const filter = useMemo(
    () =>
      record?.id !== undefined
        ? { dataId: record.id, resource: constants.R_ITEMS }
        : undefined,
    [record]
  )

  const handleOpen = (open: boolean): void => {
    setOpen(open)
  }

  return (
    <Show
      resource={constants.R_ITEMS}
      actions={
        record !== undefined && (
          <ItemShowActions handleOpen={handleOpen} record={record} />
        )
      }>
      <ShowForm setRecord={setRecord} />
      <ResourceHistoryModal
        filter={filter}
        open={open}
        close={() => {
          handleOpen(false)
        }}
      />
    </Show>
  )
}
