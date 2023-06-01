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
  useRefresh
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
import SourceField from '../../components/SourceField'
import useAudit from '../../hooks/useAudit'
import { AuditType } from '../../utils/activity-types'
import DispatchReport from './DispatchReport'
import HastenerReport from './HastenerReport'

const ShowActions = (): React.ReactElement => {
  const { hasAccess } = useCanAccess()
  return (
    <>
      <TopToolbar>
        <TopToolbarField<Dispatch> source='reference' />
        {hasAccess(constants.R_DISPATCH, { write: true }) && <EditButton />}
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
        {dispatched && !receiptReceived && (
          <Button
            variant='outlined'
            label='Hastener'
            onClick={sendHastener as any}
          />
        )}
        {dispatched && (
          <Button
            variant='outlined'
            label='Print Hastener'
            onClick={() => {
              handleOpen('hastener')
            }}
          />
        )}
        {!dispatched && (
          <>
            <Button
              variant='outlined'
              label='Print Note'
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
            filter={{ dispatched: record.id }}
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
  const notify = useNotify()
  const { id } = useParams()

  const handleOpen = (name: string): void => {
    setOpen(name)
  }

  const dispatch = async (data: UpdateParams): Promise<void> => {
    await update(constants.R_DISPATCH, data)
    notify('Element dispatched', { type: 'success' })
  }

  return (
    <FlexBox alignItems={'flex-start'}>
      <Box component='fieldset' style={{ width: '500px', padding: '0 15px' }}>
        <legend>
          <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
            Dispatch Show
          </Typography>
        </legend>
        <Box>
          <DispatchReport open={open === 'dispatch'} handleOpen={handleOpen} />
          <HastenerReport open={open === 'hastener'} handleOpen={handleOpen} />
          <Show actions={<ShowActions />} component={'div'}>
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
        destroyRemove: false,
        dispatch: false
      }}
    />
  )

  return (
    <Box component='fieldset' style={{ padding: '0 15px', overflowX: 'auto' }}>
      <legend>
        <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
          Dispatched items
        </Typography>
      </legend>
      <ItemList filter={{ dispatched: id }}>
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
      <SourceField source='protectiveMarking' reference='protectiveMarking' />
    </DatagridConfigurable>
  )
}
