import { Box, Button, Typography } from '@mui/material'
import FlexBox from '../../components/FlexBox'
import { useDataProvider, useListContext, useNotify } from 'react-admin'
import * as constants from '../../constants'
import React, { useState } from 'react'
import Printable from '../../components/Printable'

interface Props {
  onClose: () => void
  successCallback: () => void
  destructionId: string
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

export default function DestroyItems(props: Props): React.ReactElement {
  const { onClose, successCallback, destructionId } = props
  const { selectedIds: ids } = useListContext()
  const [open, setOpen] = useState(false)
  const datProvider = useDataProvider()
  const notify = useNotify()

  const onDestroy = (): void => {
    datProvider
      .updateMany<Item>(constants.R_ITEMS, {
        ids,
        data: {
          destruction: destructionId,
          destructionDate: new Date().toISOString()
        }
      })
      .then(() => {
        notify(`${ids.length} items destroyed!`)
        setOpen(true)
        successCallback()
      })
      .catch(console.log)
      .finally(() => {
        setOpen(true)
      })
  }

  return (
    <Box sx={style}>
      <Typography variant='h6'>Destroy {ids.length} items:</Typography>
      <FlexBox marginTop={3}>
        <Button variant='contained' onClick={onDestroy}>
          Destroy
        </Button>
        <Button color='secondary' variant='outlined' onClick={onClose}>
          Cancel
        </Button>
      </FlexBox>
      <DestroyItemsReport
        ids={ids}
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      />
    </Box>
  )
}

interface DestroyItemsReportProps {
  ids: number[]
  open: boolean
  onClose: () => void
}

const DestroyItemsReport = (
  props: DestroyItemsReportProps
): React.ReactElement => {
  const { open, onClose } = props

  return (
    <Printable open={open} onClose={onClose}>
      <Box>TEST</Box>
    </Printable>
  )
}
