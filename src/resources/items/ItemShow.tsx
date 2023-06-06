import React, { useEffect, useMemo, useState } from 'react'
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
import {
  Box,
  type SxProps,
  type Theme,
  Typography,
  IconButton
} from '@mui/material'
import useCanAccess from '../../hooks/useCanAccess'
import FieldWithLabel from '../../components/FieldWithLabel'
import SourceField from '../../components/SourceField'
import { History } from '@mui/icons-material'
import ResourceHistoryModal from '../../components/ResourceHistory'

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

export default function ItemShow(): React.ReactElement {
  const { hasAccess } = useCanAccess()
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
        <TopToolbar sx={{ alignItems: 'center' }}>
          <TopToolbarField source='item_number' />
          <DispatchedAt />
          {hasAccess(constants.R_ITEMS, { write: true }) && <EditButton />}
          <IconButton
            onClick={() => {
              handleOpen(true)
            }}>
            <History />
          </IconButton>
        </TopToolbar>
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
