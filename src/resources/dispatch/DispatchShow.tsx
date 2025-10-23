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
  useGetList,
  useRedirect
} from 'react-admin'
import useCanAccess from '../../hooks/useCanAccess'
import * as constants from '../../constants'
import TopToolbarField from '../../components/TopToolbarField'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import FlexBox from '../../components/FlexBox'
import { Box } from '@mui/system'
import { Typography, Tooltip } from '@mui/material'
import DispatchForm from './DispatchForm'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'
import Confirm from '../../components/Confirm'
import ItemList, { BulkActions } from '../items/ItemList'
import useAudit from '../../hooks/useAudit'
import { AuditType } from '../../utils/activity-types'
import DispatchReport from './DispatchReport'
import HastenerReport from './HastenerReport'
import HistoryButton from '../../components/HistoryButton'
import { getUser } from '../../providers/authProvider'
import {
  executeDispatch,
  type UpdateFunction,
  type UpdateManyFunction,
  type AuditFunction,
  type NotifyFunction
} from './dispatch-operations'

interface ShowActionsProps {
  showEdit: boolean
}

const ShowActions = (props: ShowActionsProps): React.ReactElement => {
  const { showEdit } = props
  const { hasAccess } = useCanAccess()
  const record = useRecordContext()
  const dispatched = typeof record?.dispatchedAt !== 'undefined'
  const redirect = useRedirect()

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
              redirect(
                `/audit?filter=${JSON.stringify({
                  dataId: record.id,
                  resource: constants.R_DISPATCH
                })}`
              )
            }}
          />
          {hasAccess(constants.R_DISPATCH, { write: true })
            ? showEdit && <EditButton />
            : null}
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
  const refresh = useRefresh()
  const [update] = useUpdate()
  const notify = useNotify()
  const user = getUser()
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

  if (typeof record === 'undefined') return <></>
  const rolesThatCanCreateReceiptNote = ['rco-user', 'rco-power-user']
  return (
    <>
      {user && rolesThatCanCreateReceiptNote.includes(user.userRole) ? (
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
              <Tooltip title='Last Hastener Sent Date is updated automatically when hastener is printed'>
                <span>
                  <Button
                    variant='outlined'
                    label='Record Hastener Sent'
                    disabled={true}
                  />
                </span>
              </Tooltip>
              <Button
                variant='outlined'
                label='Receipt Note Received'
                onClick={sendReceiptReceived as any}
              />
            </FlexBox>
          )}
        </FlexBox>
      ) : null}

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
  const refresh = useRefresh()
  const { id } = useParams()
  const { data: itemsAdded = [] } = useGetList(constants.R_ITEMS, {
    filter: { dispatchJob: id },
    pagination: { page: 1, perPage: 1000 }
  })
  const { data: record } = useGetOne(constants.R_DISPATCH, { id })

  const handleOpen = (name: DestructionModal): void => {
    setOpen(name)
  }

  const dispatch = async (data: UpdateParams): Promise<void> => {
    if (!record?.id || !id) return

    await executeDispatch(
      itemsAdded as Item[],
      parseInt(id),
      record.id as number,
      data,
      update as UpdateFunction,
      updateMany as UpdateManyFunction,
      audit as AuditFunction,
      notify as NotifyFunction
    )
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

  const saveHastenerPrinted = async (): Promise<void> => {
    try {
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
    } catch (error) {
      notify('Failed to update hastener sent date', { type: 'error' })
      console.error(error)
    }
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
          <HastenerReport
            open={open === 'hastener'}
            handleOpen={handleOpen}
            onPrint={() => {
              saveHastenerPrinted().catch(console.error)
            }}
          />
          <Show
            actions={
              <ShowActions
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
  const dispatched: boolean =
    data?.dispatchedAt !== undefined && data?.dispatchedAt !== null

  const canEditItem: boolean = useMemo(() => {
    const permission = hasAccess(constants.R_ITEMS, { write: true })
    return !permission
  }, [data])

  const preferenceKey = `datagrid-${constants.R_DISPATCH}-${id}-items-list`

  const bulkActionButtons: false | React.ReactElement = canEditItem ? (
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
      {dispatched ? (
        <Typography variant='caption' align='center' sx={{ fontWeight: '600' }}>
          Items not shown for completed dispatch.
          <br />
          Note: this data can be determined in the backend
        </Typography>
      ) : (
        <ItemList
          storeKey={`${constants.R_DISPATCH}-${id}-items-list`}
          filter={{ dispatchJob: id }}
          preferenceKey={preferenceKey}
          bulkActionButtons={
            bulkActionButtons ?? <BulkActions preferenceKey={preferenceKey} />
          }
          filtersShown={['q', 'batch', 'mediaType']}
        />
      )}
    </Box>
  )
}
