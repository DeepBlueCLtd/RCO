import {
  Button,
  Count,
  EditButton,
  Show,
  TopToolbar,
  type UpdateParams,
  useGetOne,
  useNotify,
  useRecordContext,
  useUpdate,
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
import { Typography } from '@mui/material'
import DispatchForm from './DispatchForm'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'
import Confirm from '../../components/Confirm'
import ItemList, { BulkActions } from '../items/ItemList'
import useAudit from '../../hooks/useAudit'
import { AuditType } from '../../utils/activity-types'
import DispatchReport from './DispatchReport'
import HastenerReport from './HastenerReport'
import ResourceHistoryModal from '../../components/ResourceHistory'
import HistoryButton from '../../components/HistoryButton'
import { type AuditData } from '../../utils/audit'

interface ShowActionsProps {
  handleOpen: (open: DestructionModal) => void
  showEdit: boolean
}

const ShowActions = (props: ShowActionsProps): React.ReactElement => {
  const { handleOpen, showEdit } = props
  const { hasAccess } = useCanAccess()
  const record = useRecordContext()
  const dispatched = typeof record?.dispatchedAt !== 'undefined'

  return (
    <>
      <TopToolbar>
        <FlexBox>
          <TopToolbarField<Dispatch> source='name' />
          {hasAccess(constants.R_DISPATCH, { write: true }) && !dispatched && (
            <EditButton />
          )}
          <HistoryButton
            onClick={() => {
              handleOpen('history')
            }}
          />
          {showEdit && <EditButton />}
        </FlexBox>
      </TopToolbar>
    </>
  )
}

interface FooterProps {
  handleOpen: (name: DestructionModal) => void
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
  const notify = useNotify()

  const dispatched: boolean =
    !hasWritePermission ||
    (typeof record?.dispatchedAt !== 'undefined' &&
      record?.dispatchedAt !== null &&
      record?.dispatchedAt !== 'null')

  const receiptReceived: boolean =
    !hasWritePermission ||
    (typeof record?.receiptReceived !== 'undefined' &&
      record?.receiptReceived !== null)

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

  const sendReceiptReceived = async (): Promise<void> => {
    await update(constants.R_DISPATCH, {
      id: record.id,
      data: {
        receiptReceived: nowDate()
      },
      previousData: record
    })
    refresh()
    notify('Receipt Received', {
      type: 'success'
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
      activityType: AuditType.EDIT,
      activityDetail: 'Hastener sent',
      securityRelated: false,
      resource: constants.R_DISPATCH,
      dataId: record.id,
      subjectId: null,
      subjectResource: null
    })
  }

  if (typeof record === 'undefined') return <></>

  return (
    <>
      <FlexBox flexDirection='column' gap='6px' marginBottom='20px'>
        <FlexBox justifyContent='space-around'>
          <Button
            variant='outlined'
            label='Print Receipt'
            onClick={() => {
              handleOpen('dispatch')
            }}
          />
          {dispatched ? (
            <Button
              variant='outlined'
              label='Print Hastener'
              onClick={() => {
                handleOpen('hastener')
              }}
            />
          ) : (
            <Button
              variant='contained'
              label='Dispatch'
              disabled={!record.reportPrintedAt}
              onClick={handleDispatch}
            />
          )}
        </FlexBox>
        {dispatched && !receiptReceived && (
          <FlexBox justifyContent='space-around'>
            <Button
              variant='outlined'
              label='Record Hastener Sent'
              onClick={sendHastener as any}
            />
            <Button
              variant='outlined'
              label='Receipt Note Received'
              onClick={sendReceiptReceived as any}
            />
          </FlexBox>
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

export type DestructionModal = 'history' | 'hastener' | 'dispatch' | ''

export default function DispatchShow(): React.ReactElement {
  const [open, setOpen] = useState<DestructionModal>()
  const [update] = useUpdate()
  const [updateMany] = useUpdateMany()
  const notify = useNotify()
  const audit = useAudit()
  const { id } = useParams()
  const { data: itemsAdded = [] } = useGetList(constants.R_ITEMS, {
    filter: { dispatchJob: id }
  })
  const { data: record } = useGetOne(constants.R_DISPATCH, { id })

  const handleOpen = (name: DestructionModal): void => {
    setOpen(name)
  }

  const dispatchAudits = async (itemId: Item['id']): Promise<void> => {
    const audiData: AuditData = {
      activityType: AuditType.SENT,
      activityDetail: 'Dispatch Sent',
      securityRelated: false,
      resource: constants.R_ITEMS,
      dataId: itemId,
      subjectId: record.id,
      subjectResource: constants.R_DISPATCH
    }
    await audit(audiData)
  }

  const dispatch = async (data: UpdateParams): Promise<void> => {
    const audiData: AuditData = {
      activityType: AuditType.SENT,
      activityDetail: 'Dispatch Sent',
      securityRelated: false,
      resource: constants.R_DISPATCH,
      dataId: parseInt(id as string),
      subjectId: id ? Number(id) : null,
      subjectResource: constants.R_ITEMS
    }
    await audit(audiData)
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

  const saveReportPrinted = (): void => {
    update(constants.R_DISPATCH, {
      id: record.id,
      previousData: record,
      data: {
        reportPrintedAt: nowDate()
      }
    })
      .then(console.log)
      .catch(console.error)
  }

  return (
    <FlexBox alignItems={'flex-start'}>
      <Box component='fieldset' style={{ width: '500px', padding: '0 15px' }}>
        <legend>
          <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
            Dispatch
          </Typography>
        </legend>
        <Box>
          <DispatchReport
            onPrint={saveReportPrinted}
            open={open === 'dispatch'}
            handleOpen={handleOpen}
          />
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
            actions={
              <ShowActions
                handleOpen={handleOpen}
                showEdit={
                  record?.dispatchedAt === null ||
                  record?.dispatchedAt === undefined ||
                  record?.dispatchedAt === 'null'
                }
              />
            }
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

  const preferenceKey = `datagrid-${constants.R_DISPATCH}-${id}-items-list`

  const bulkActionButtons: false | React.ReactElement = destroyed ? (
    false
  ) : (
    <BulkActions
      buttons={{
        destroy: false,
        location: false,
        loan: false,
        dispatchRemove: true,
        dispatch: false
      }}
      preferenceKey={preferenceKey}
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
        preferenceKey={preferenceKey}
        bulkActionButtons={
          bulkActionButtons ?? <BulkActions preferenceKey={preferenceKey} />
        }
        filtersShown={['q', 'batch', 'mediaType']}
      />
    </Box>
  )
}
