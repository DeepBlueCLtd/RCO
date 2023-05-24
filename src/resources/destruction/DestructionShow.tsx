import React, { useMemo, useState } from 'react'
import {
  Button,
  DateField,
  Show,
  SimpleShowLayout,
  TextField,
  useRecordContext,
  useUpdate,
  useGetIdentity,
  useNotify,
  useGetOne
} from 'react-admin'
import { Box, Typography } from '@mui/material'
import FlexBox from '../../components/FlexBox'
import * as constants from '../../constants'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'
import DestructionReport from './DestructionReport'
import ItemList, { BulkActions } from '../items/ItemList'
import { useParams } from 'react-router-dom'
import useCanAccess from '../../hooks/useCanAccess'

const Finalised = (): React.ReactElement => {
  const record = useRecordContext<Destruction>()

  const label =
    typeof record?.finalisedAt !== 'undefined' ? 'Finlised' : 'Pending'

  return <Typography variant='body2'>{label}</Typography>
}

interface FooterProps {
  handleOpen: (open: boolean) => void
  destroy: (updateData: any) => Promise<void>
}

const Footer = (props: FooterProps): React.ReactElement => {
  const record = useRecordContext<Destruction>()
  const { hasAccess } = useCanAccess()
  const hasWritePermission = hasAccess(constants.R_ITEMS, { write: true })
  const { data } = useGetIdentity()
  const { handleOpen, destroy } = props

  const destroyed: boolean =
    !hasWritePermission || typeof record?.finalisedAt !== 'undefined'

  return (
    <FlexBox justifyContent='end' padding={2}>
      <Button
        variant='outlined'
        label='Report'
        disabled={!destroyed}
        onClick={() => {
          handleOpen(true)
        }}
      />
      <Button
        variant='contained'
        label='Destroy'
        disabled={destroyed}
        onClick={() =>
          destroy({
            id: record.id,
            data: {
              finalisedBy: data?.id,
              finalisedAt: nowDate()
            }
          }) as any
        }
      />
    </FlexBox>
  )
}

export default function DestructionShow(): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false)
  const [update] = useUpdate()
  const notify = useNotify()
  const { id } = useParams()

  const handleOpen = (open: boolean): void => {
    setOpen(open)
  }

  const destroy = async (updateData: any): Promise<void> => {
    await update(constants.R_DESTRUCTION, updateData)
    notify('Element destroyed', { type: 'success' })
  }

  return (
    <FlexBox maxWidth={'100vw'}>
      <Box component='fieldset' style={{ width: '500px', padding: '0 15px' }}>
        <legend>
          <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
            Destruction Show
          </Typography>
        </legend>
        <Box>
          <DestructionReport open={open} handleOpen={handleOpen} />
          <Show component={'div'}>
            <SimpleShowLayout>
              <TextField source='reference' />
              <DateField source='finalisedAt' />
              <Finalised />
              <TextField source='remarks' />
            </SimpleShowLayout>
            <Footer handleOpen={handleOpen} destroy={destroy} />
          </Show>
        </Box>
      </Box>
      {typeof id !== 'undefined' && <DestructionItemList id={id} />}
    </FlexBox>
  )
}

interface DestructionItemListProps { id: string }

function DestructionItemList(
  props: DestructionItemListProps
): React.ReactElement {
  const { id } = props
  const { hasAccess } = useCanAccess()
  const { data } = useGetOne<Destruction>(constants.R_DESTRUCTION, {
    id: Number(id)
  })

  const destroyed: boolean = useMemo(() => {
    const permission = hasAccess(constants.R_ITEMS, { write: true })
    return !permission || typeof data?.finalisedAt !== 'undefined'
  }, [data])

  return (
    <Box component='fieldset' style={{ padding: '0 15px', overflowX: 'auto' }}>
      <legend>
        <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
          Destruction items
        </Typography>
      </legend>
      <ItemList
        filter={{ destruction: id }}
        bulkActionButtons={
          destroyed ? (
            false
          ) : (
            <BulkActions
              buttons={{
                destroy: false,
                location: false,
                loan: false,
                destroyRemove: true
              }}
            />
          )
        }
      />
    </Box>
  )
}
