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
  useGetOne,
  type UpdateParams,
  Count,
  type DatagridConfigurableProps,
  DatagridConfigurable,
  useUpdateMany,
  useGetList,
  TopToolbar,
  EditButton
} from 'react-admin'
import { Box, IconButton, Typography } from '@mui/material'
import FlexBox from '../../components/FlexBox'
import * as constants from '../../constants'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'
import DestructionReport from './DestructionReport'
import ItemList, { BulkActions } from '../items/ItemList'
import { useParams } from 'react-router-dom'
import useCanAccess from '../../hooks/useCanAccess'
import Confirm from '../../components/Confirm'
import SourceField from '../../components/SourceField'
import useAudit from '../../hooks/useAudit'
import { AuditType } from '../../utils/activity-types'
import ResourceHistoryModal from '../../components/ResourceHistory'
import { History } from '@mui/icons-material'

const Finalised = (): React.ReactElement => {
  const record = useRecordContext<Destruction>()

  const label =
    typeof record?.finalisedAt !== 'undefined' ? 'Finalised' : 'Pending'

  return <Typography variant='body2'>{label}</Typography>
}

interface ShowActionsProps {
  handleOpen: (open: string) => void
}

const ShowActions = (props: ShowActionsProps): React.ReactElement => {
  const { handleOpen } = props
  const { hasAccess } = useCanAccess()
  const record = useRecordContext()
  const finalised = typeof record.finalisedAt !== 'undefined'

  return (
    <>
      <TopToolbar>
        {hasAccess(constants.R_DESTRUCTION, { write: true }) && !finalised && (
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
  handleOpen: (open: string) => void
  destroy: (data: UpdateParams) => Promise<void>
}

const Footer = (props: FooterProps): React.ReactElement => {
  const record = useRecordContext<Destruction>()
  const { hasAccess } = useCanAccess()
  const [open, setOpen] = useState(false)
  const hasWritePermission = hasAccess(constants.R_ITEMS, { write: true })
  const { data } = useGetIdentity()
  const { handleOpen, destroy } = props

  const destroyed: boolean =
    !hasWritePermission || typeof record?.finalisedAt !== 'undefined'

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

  return (
    <>
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
          disabled={destroyed}
          onClick={handleDestroy}
        />
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
            filter={{ destruction: record.id }}
            resource={constants.R_ITEMS}
          />{' '}
          items have been sent for destruction?
        </Typography>
      </Confirm>
    </>
  )
}

export type ModalState = 'history' | 'report' | ''

export default function DestructionShow(): React.ReactElement {
  const [open, setOpen] = useState<ModalState>('')
  const [update] = useUpdate()
  const [updateMany] = useUpdateMany()
  const notify = useNotify()
  const audit = useAudit()
  const { id } = useParams()
  const { data: itemsAdded = [] } = useGetList(constants.R_ITEMS, {
    filter: { destruction: id }
  })

  const handleOpen = (value: string): void => {
    setOpen(value as ModalState)
  }

  const DestroyAudits = async (item: Item): Promise<void> => {
    const audiData = {
      type: AuditType.EDIT,
      activityDetail: 'add item to destruction',
      securityRelated: false,
      resource: constants.R_ITEMS,
      dataId: item.id
    }
    await audit(audiData)
    await audit({
      ...audiData,
      resource: constants.R_DESTRUCTION
    })
  }

  const destroy = async (data: UpdateParams): Promise<void> => {
    const ids = itemsAdded.map((item: Item) => item.id)
    await update(constants.R_DESTRUCTION, data)
    await updateMany(constants.R_ITEMS, {
      ids,
      data: {
        destructionDate: nowDate()
      }
    })
    itemsAdded
      .filter(({ loanedDate, loanedTo, destructionDate, id }) => {
        return (
          ids.includes(id) &&
          typeof loanedTo === 'undefined' &&
          typeof loanedDate === 'undefined' &&
          typeof destructionDate === 'undefined'
        )
      })
      .forEach(DestroyAudits as any)
    notify('Element destroyed', { type: 'success' })
  }

  return (
    <FlexBox maxWidth={'100vw'}>
      <Box component='fieldset' style={{ width: '500px', padding: '0 15px' }}>
        <legend>
          <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
            Destruction Job
          </Typography>
        </legend>
        <Box>
          <DestructionReport open={open === 'report'} handleOpen={handleOpen} />
          <ResourceHistoryModal
            filter={{
              resource: constants.R_DESTRUCTION,
              dataId: parseInt(id as string)
            }}
            open={open === 'history'}
            close={() => {
              handleOpen('')
            }}
          />
          <Show
            component={'div'}
            actions={<ShowActions handleOpen={handleOpen} />}>
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

  const destroyed: boolean = useMemo(() => {
    const permission = hasAccess(constants.R_ITEMS, { write: true })
    return !permission || typeof data?.finalisedAt !== 'undefined'
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
        filter={{ destruction: id }}>
        <ItemListDataTable
          preferenceKey={`datagrid-${constants.R_DESTRUCTION}-${id}-items-list`}
          bulkActionButtons={bulkActionButtons}
        />
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
      preferenceKey={props.preferenceKey}
      {...props}>
      <SourceField
        link='show'
        source='mediaType'
        reference={constants.R_MEDIA_TYPE}
        label='Media type'
      />
      <SourceField
        link='show'
        source='mediaType'
        reference={constants.R_MEDIA_TYPE}
        label='Media type'
      />
      <SourceField
        source='protectiveMarking'
        reference={constants.R_PROTECTIVE_MARKING}
      />
    </DatagridConfigurable>
  )
}
