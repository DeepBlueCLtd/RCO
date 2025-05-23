import React, { useMemo, useState } from 'react'
import {
  Button,
  Show,
  SimpleShowLayout,
  TextField,
  useRecordContext,
  useUpdate,
  useGetIdentity,
  useNotify,
  useGetOne,
  type UpdateParams,
  Count,
  useUpdateMany,
  useGetList,
  TopToolbar,
  EditButton,
  useRedirect
} from 'react-admin'
import { Box, Typography } from '@mui/material'
import FlexBox from '../../components/FlexBox'
import * as constants from '../../constants'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'
import DestructionReport from './DestructionReport'
import ItemList, { BulkActions } from '../items/ItemList'
import { useParams } from 'react-router-dom'
import useCanAccess from '../../hooks/useCanAccess'
import Confirm from '../../components/Confirm'
import useAudit from '../../hooks/useAudit'
import { AuditType } from '../../utils/activity-types'
import HistoryButton from '../../components/HistoryButton'
import { type AuditData } from '../../utils/audit'
import { ConditionalDateField } from '../dispatch/DispatchList'
import { getUser } from '../../providers/authProvider'

const Finalised = (): React.ReactElement => {
  const record = useRecordContext<Destruction>()

  const label =
    typeof record?.finalisedAt !== 'undefined' ? 'Finalised' : 'Pending'

  return <Typography variant='body2'>{label}</Typography>
}

const ShowActions = (): React.ReactElement => {
  const { hasAccess } = useCanAccess()
  const record = useRecordContext()
  const finalised =
    typeof record?.finalisedAt !== 'undefined' &&
    record?.finalisedAt !== null &&
    record?.finalisedAt !== 'null'
  const redirect = useRedirect()

  return (
    <>
      <TopToolbar>
        {hasAccess(constants.R_DESTRUCTION, { write: true }) && !finalised && (
          <EditButton />
        )}
        <HistoryButton
          onClick={() => {
            redirect(
              `/audit?filter=${JSON.stringify({
                resource: constants.R_DESTRUCTION,
                dataId: record.id
              })}`
            )
          }}
        />
      </TopToolbar>
    </>
  )
}

interface FooterProps {
  handleOpen: (open: DestructionModal) => void
  destroy: (data: UpdateParams) => Promise<void>
}

const Footer = (props: FooterProps): React.ReactElement => {
  const record = useRecordContext<Destruction>()
  const { hasAccess } = useCanAccess()
  const [open, setOpen] = useState(false)
  const hasWritePermission = hasAccess(constants.R_ITEMS, { write: true })
  const { data } = useGetIdentity()
  const { handleOpen, destroy } = props
  const user = getUser()
  const destroyed: boolean =
    !hasWritePermission ||
    (typeof record?.finalisedAt !== 'undefined' &&
      record?.finalisedAt !== null &&
      record?.finalisedAt !== 'null')

  const handleDestroy = (): void => {
    setOpen(true)
  }

  const onConfirm = async (): Promise<void> => {
    setOpen(false)
    await destroy({
      id: record.id,
      previousData: record,
      data: {
        finalisedBy: data?.id,
        finalisedAt: nowDate()
      }
    })
  }

  if (typeof record === 'undefined') return <></>
  const DestructionCetificateAndDestoryCanAccessBy = [
    'rco-user',
    'rco-power-user'
  ]
  return (
    <>
      {user &&
      DestructionCetificateAndDestoryCanAccessBy.includes(user.userRole) ? (
        <FlexBox justifyContent='end' padding={2}>
          <Button
            variant='outlined'
            label='Destruction Certificate'
            onClick={() => {
              handleOpen('report')
            }}
          />
          <Button
            variant='contained'
            label='Destroy'
            disabled={destroyed || !record.reportPrintedAt}
            onClick={handleDestroy}
          />
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
            filter={{ destruction: record.id }}
            resource={constants.R_ITEMS}
          />{' '}
          items have been sent for destruction?
        </Typography>
      </Confirm>
    </>
  )
}

export type DestructionModal = 'history' | 'report' | ''

export default function DestructionShow(): React.ReactElement {
  const [open, setOpen] = useState<DestructionModal>('')
  const [update] = useUpdate()
  const [updateMany] = useUpdateMany()
  const notify = useNotify()
  const audit = useAudit()
  const { id } = useParams()
  const { data: itemsAdded = [] } = useGetList(constants.R_ITEMS, {
    filter: { destruction: id }
  })
  const { data: record } = useGetOne(constants.R_DESTRUCTION, { id })

  const handleOpen = (value: DestructionModal): void => {
    setOpen(value)
  }

  const DestroyAudits = async (item: Item): Promise<void> => {
    const audiData: AuditData = {
      activityType: AuditType.DESTROY,
      activityDetail: 'Destroyed',
      securityRelated: false,
      resource: constants.R_ITEMS,
      dataId: item.id,
      subjectId: record.id,
      subjectResource: constants.R_DESTRUCTION
    }
    await audit(audiData)
  }

  const destroy = async (data: UpdateParams): Promise<void> => {
    const audiData = {
      activityType: AuditType.DESTROY,
      activityDetail: 'Destroyed',
      securityRelated: false,
      resource: constants.R_DESTRUCTION,
      dataId: parseInt(id as string),
      subjectId: id ? Number(id) : null,
      subjectResource: constants.R_ITEMS
    }
    await audit(audiData)
    const ids = itemsAdded.map((item: Item) => item.id)
    await update(constants.R_DESTRUCTION, data)
    await updateMany(constants.R_ITEMS, {
      ids,
      data: {
        destructionDate: nowDate()
      }
    })
    itemsAdded.forEach(DestroyAudits as any)
    notify('Element destroyed', { type: 'success' })
  }

  const saveReportPrinted = (): void => {
    update(constants.R_DESTRUCTION, {
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
    <FlexBox maxWidth={'100vw'}>
      <Box component='fieldset' style={{ width: '500px', padding: '0 15px' }}>
        <legend>
          <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
            Destruction
          </Typography>
        </legend>
        <Box>
          <DestructionReport
            onPrint={saveReportPrinted}
            open={open === 'report'}
            handleOpen={handleOpen}
          />
          <Show component={'div'} actions={<ShowActions />}>
            <SimpleShowLayout>
              <TextField<Destruction> source='name' label='Reference' />
              <ConditionalDateField<Destruction>
                label='Finalised at'
                source='finalisedAt'
                resource={constants.R_DESTRUCTION}
              />
              <Finalised />
              <TextField<Destruction> source='remarks' />
              <TextField<Destruction> source='vault' />
            </SimpleShowLayout>
            <Footer handleOpen={handleOpen} destroy={destroy} />
          </Show>
        </Box>
      </Box>
      {typeof id !== 'undefined' && <DestructionItemList id={id} />}
    </FlexBox>
  )
}

interface DestructionItemListProps {
  id: string
}

function DestructionItemList(
  props: DestructionItemListProps
): React.ReactElement {
  const { id } = props
  const { hasAccess } = useCanAccess()
  const { data } = useGetOne<Destruction>(constants.R_DESTRUCTION, {
    id: Number(id)
  })
  const preferenceKey = `datagrid-${constants.R_DESTRUCTION}-${id}-items-list`

  const destroyed: boolean = useMemo(() => {
    const permission = hasAccess(constants.R_ITEMS, { write: true })
    return permission && !!data?.finalisedAt
  }, [data])

  const bulkActionButtons: false | React.ReactElement = destroyed ? (
    false
  ) : (
    <BulkActions
      buttons={{
        destroy: false,
        dispatch: false,
        location: false,
        loan: false,
        destroyRemove: true
      }}
      preferenceKey={preferenceKey}
    />
  )

  return (
    <Box component='fieldset' style={{ padding: '0 15px', overflowX: 'auto' }}>
      <legend>
        <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
          {destroyed ? 'Items destroyed' : 'Items to be destroyed'}
        </Typography>
      </legend>
      <ItemList
        storeKey={`${constants.R_DESTRUCTION}-${id}-items-list`}
        filter={{ destruction: id }}
        preferenceKey={preferenceKey}
        bulkActionButtons={
          bulkActionButtons ?? <BulkActions preferenceKey={preferenceKey} />
        }
      />
    </Box>
  )
}
