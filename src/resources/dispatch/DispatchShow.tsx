import {
  Button,
  Count,
  DatagridConfigurable,
  type DatagridConfigurableProps,
  EditButton,
  Show,
  TopToolbar,
  type UpdateParams,
  useGetOne,
  useNotify,
  useRecordContext,
  useUpdate,
  TextField,
  useRefresh,
  useUpdateMany,
  useGetList
} from 'react-admin'
import useCanAccess from '../../hooks/useCanAccess'
import * as constants from '../../constants'
import TopToolbarField from '../../components/TopToolbarField'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import FlexBox from '../../components/FlexBox'
import { Box } from '@mui/system'
import { IconButton, Typography } from '@mui/material'
import DispatchForm from './DispatchForm'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'
import Confirm from '../../components/Confirm'
import ItemList, { BulkActions } from '../items/ItemList'
import SourceField from '../../components/SourceField'
import useAudit from '../../hooks/useAudit'
import { AuditType } from '../../utils/activity-types'
import DispatchReport from './DispatchReport'
import HastenerReport from './HastenerReport'
import { History } from '@mui/icons-material'
import ResourceHistoryModal from '../../components/ResourceHistory'

interface ShowActionsProps {
  handleOpen: (open: string) => void
}

const ShowActions = (props: ShowActionsProps): React.ReactElement => {
  const { handleOpen } = props
  const { hasAccess } = useCanAccess()
  const record = useRecordContext()
  const dispatched = typeof record.dispatchedAt !== 'undefined'

  return (
    <>
      <TopToolbar>
        <TopToolbarField<Dispatch> source='reference' />
        {hasAccess(constants.R_DISPATCH, { write: true }) && !dispatched && (
          <EditButton />
        )}
        <IconButton
          onClick={() => {
            handleOpen('history')
          }}>
          <History />
        </IconButton>
      </TopToolbar>
    </>
  )
}

interface FooterProps {
  handleOpen: (name: string) => void
  dispatch: (data: UpdateParams) => Promise<void>
}

const Footer = (props: FooterProps): React.ReactElement => {
  const [open, setOpen] = useState(false)
  const record = useRecordContext<Dispatch>()
  const { hasAccess } = useCanAccess()
  const hasWritePermission = hasAccess(constants.R_ITEMS, { write: true })
  const { handleOpen, dispatch } = props
  const audit = useAudit()
  const refresh = useRefresh()
  const [update] = useUpdate()

  const dispatched: boolean =
    !hasWritePermission || typeof record?.dispatchedAt !== 'undefined'

  const receiptReceived: boolean =
    !hasWritePermission || typeof record?.receiptReceived !== 'undefined'

  const handleDispatch = (): void => {
    setOpen(true)
  }
  const onConfirm = async (): Promise<void> => {
    setOpen(false)
    await dispatch({
      id: record.id,
      previousData: record,
      data: {
        dispatchedAt: nowDate()
      }
    })
  }

  const sendHastener = async (): Promise<void> => {
    await update(constants.R_DISPATCH, {
      id: record.id,
      previousData: record,
      data: {
        lastHastenerSent: nowDate()
      }
    })
    refresh()
    await audit({
      type: AuditType.EDIT,
      activityDetail: 'Hastener sent',
      securityRelated: false,
      resource: constants.R_DISPATCH,
      dataId: record.id
    })
  }

  if (typeof record === 'undefined') return <></>

  return (
    <>
      <FlexBox justifyContent='end' padding={2}>
        {dispatched && (
          <Button
            variant='outlined'
            label='Print Hastener'
            onClick={() => {
              handleOpen('hastener')
            }}
          />
        )}
        {dispatched && !receiptReceived && (
          <Button
            variant='outlined'
            label='Record Hastener Sent'
            onClick={sendHastener as any}
          />
        )}
        {!dispatched && (
          <>
            <Button
              variant='outlined'
              label='Print Receipt'
              onClick={() => {
                handleOpen('dispatch')
              }}
            />
            <Button
              variant='contained'
              label='Dispatch'
              disabled={dispatched}
              onClick={handleDispatch}
            />
          </>
        )}
      </FlexBox>
      <Confirm
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        onOk={onConfirm as any}>
        <Typography>
          Are you sure{' '}
          <Count
            filter={{ dispatchJob: record.id }}
            resource={constants.R_ITEMS}
          />{' '}
          items have been sent for dispatch?
        </Typography>
      </Confirm>
    </>
  )
}

export default function DispatchShow(): React.ReactElement {
  const [open, setOpen] = useState<string>()
  const [update] = useUpdate()
  const [updateMany] = useUpdateMany()
  const notify = useNotify()
  const audit = useAudit()
  const { id } = useParams()
  const { data: itemsAdded = [] } = useGetList(constants.R_ITEMS, {
    filter: { dispatchJob: id }
  })

  const handleOpen = (name: string): void => {
    setOpen(name)
  }

  const dispatchAudits = async (itemId: Item['id']): Promise<void> => {
    const audiData = {
      type: AuditType.EDIT,
      activityDetail: 'add item to dispatch',
      securityRelated: false,
      resource: constants.R_ITEMS,
      dataId: itemId
    }
    await audit(audiData)
    await audit({
      ...audiData,
      resource: constants.R_DISPATCH
    })
  }

  const dispatch = async (data: UpdateParams): Promise<void> => {
    const ids = itemsAdded.map((item) => item.id)
    await update(constants.R_DISPATCH, data)
    await updateMany(constants.R_ITEMS, {
      ids,
      data: {
        dispatchedDate: nowDate()
      }
    })
    ids.map(dispatchAudits)
    notify('Element dispatched', { type: 'success' })
  }

  return (
    <FlexBox alignItems={'flex-start'}>
      <Box component='fieldset' style={{ width: '500px', padding: '0 15px' }}>
        <legend>
          <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
            Dispatch Job
          </Typography>
        </legend>
        <Box>
          <DispatchReport open={open === 'dispatch'} handleOpen={handleOpen} />
          <HastenerReport open={open === 'hastener'} handleOpen={handleOpen} />
          <ResourceHistoryModal
            filter={{
              resource: constants.R_DISPATCH,
              dataId: parseInt(id as string)
            }}
            open={open === 'history'}
            close={() => {
              handleOpen('')
            }}
          />
          <Show
            actions={<ShowActions handleOpen={handleOpen} />}
            component={'div'}>
            <DispatchForm show />
            <Footer handleOpen={handleOpen} dispatch={dispatch} />
          </Show>
        </Box>
      </Box>
      {typeof id !== 'undefined' && <DispatchedItemList id={id} />}
    </FlexBox>
  )
}

interface DispatchedItemListProps {
  id: string
}

function DispatchedItemList(
  props: DispatchedItemListProps
): React.ReactElement {
  const { id } = props
  const { hasAccess } = useCanAccess()
  const { data } = useGetOne<Dispatch>(constants.R_DISPATCH, {
    id: Number(id)
  })
  const dispatched: boolean = data?.dispatchedAt !== undefined

  const destroyed: boolean = useMemo(() => {
    const permission = hasAccess(constants.R_ITEMS, { write: true })
    return !permission
  }, [data])

  const bulkActionButtons: false | React.ReactElement = destroyed ? (
    false
  ) : (
    <BulkActions
      buttons={{
        destroy: false,
        location: false,
        loan: false,
        dispatchRemove: true,
        dispatch: false,
        isReturn: dispatched
      }}
    />
  )

  const title = dispatched ? 'Dispatched items' : 'Items for dispatch'

  return (
    <Box component='fieldset' style={{ padding: '0 15px', overflowX: 'auto' }}>
      <legend>
        <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
          {title}
        </Typography>
      </legend>
      <ItemList
        storeKey={`${constants.R_DISPATCH}-${id}-items-list`}
        filter={{ dispatchJob: id }}
        filtersShown={['q', 'batchId', 'mediaType']}>
        <ItemListDataTable bulkActionButtons={bulkActionButtons} />
      </ItemList>
    </Box>
  )
}

function ItemListDataTable(
  props: DatagridConfigurableProps
): React.ReactElement {
  return (
    <DatagridConfigurable
      rowClick='show'
      bulkActionButtons={props?.bulkActionButtons ?? <BulkActions />}
      omit={props?.omit}
      {...props}>
      <TextField source='item_number' label='Reference' />
      <TextField source='mediaType' label='Media type' />
      <TextField source='consecPages' label='Consec Serial' />
      <SourceField
        source='protectiveMarking'
        reference={constants.R_PROTECTIVE_MARKING}
      />
    </DatagridConfigurable>
  )
}
