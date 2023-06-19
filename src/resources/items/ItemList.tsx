import {
  DateField,
  FilterButton,
  type ListProps,
  SearchInput,
  SelectColumnsButton,
  TextField,
  TextInput,
  TopToolbar,
  useListContext,
  useRefresh,
  type SortPayload,
  type FilterPayload,
  type DatagridConfigurableProps,
  useDataProvider,
  useResourceDefinition,
  useNotify,
  useGetMany
} from 'react-admin'
import SourceField from '../../components/SourceField'
import SourceInput from '../../components/SourceInput'
import * as constants from '../../constants'
import CreatedByMeFilter from '../../components/CreatedByMeFilter'
import { ItemAssetReport } from './ItemsReport'
import { Button, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FlexBox from '../../components/FlexBox'
import ChangeLocation from './ItemForm/ChangeLocation'
import DateFilter, { ResetDateFilter } from '../../components/DateFilter'
import LoanItemsListBulkActionButtons from './LoanItemsListBulkActionButtons'
import DateRangePicker from '../../components/DateRangePicker'
import useCanAccess from '../../hooks/useCanAccess'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import DestroyItems from './DestroyItems'
import DestroyRestoreItems from './DestroyRestoreItems'
import { AuditType } from '../../utils/activity-types'
import useAudit from '../../hooks/useAudit'
import BooleanFilter from '../../components/BooleanFilter'
import DatagridConfigurableWithShow from '../../components/DatagridConfigurableWithShow'
import { RestoreFromTrash } from '@mui/icons-material'
import DispatchItems from './DispatchItems'
import List from '../../components/ListWithLocalStore'

const sort = (field = 'name'): SortPayload => ({ field, order: 'ASC' })

const omitColumns: string[] = [
  'id',
  'createdAt',
  'remarks',
  'startDate',
  'endDate',
  'vaultLocation',
  'musterRemarks',
  'loanedTo'
]

const filters = [
  <SearchInput source='q' key='q' alwaysOn placeholder='Reference' />,
  <CreatedByMeFilter
    key='createdByMe'
    source='createdBy_eq'
    label='Created By Me'
  />,
  <SourceInput
    key='createdBy'
    source='createdBy'
    reference={constants.R_USERS}
  />,
  <SourceInput
    key='loanedTo'
    source='loanedTo'
    reference={constants.R_USERS}
  />,
  <TextInput source='item_number' key='item_number' label='Reference' />,
  <SourceInput
    key='mediaType'
    source='mediaType'
    reference={constants.R_MEDIA_TYPE}
  />,
  <DateRangePicker
    startSource='end_gte'
    endSource='start_lte'
    startLabel='Start'
    endLabel='End'
    source='date_range'
    key='date_range'
    label='Date Range'
  />,
  <SourceInput
    source='vaultLocation'
    key='vaultLocation'
    sort={sort()}
    reference='vaultLocation'
  />,
  <SourceInput
    source='protectiveMarking'
    key='protectiveMarking'
    sort={sort()}
    reference='protectiveMarking'
  />,
  <SourceInput
    source='batchId'
    key='batchId'
    sort={sort('batchNumber')}
    reference={constants.R_BATCHES}
    optionField='batchNumber'
  />,
  <TextInput key='remarks' source='remarks' />,
  <DateFilter source='createdAt' label='Created At' key='createdAt' />,
  <BooleanFilter<Item>
    source='id'
    label='On loan'
    fieldName='loanedTo'
    key='loaned'
    resource={constants.R_ITEMS}
  />,
  <BooleanFilter<Item>
    source='destruction'
    label='Destroyed'
    fieldName='destruction'
    key='destruction'
    resource={constants.R_ITEMS}
  />,
  <BooleanFilter<Item>
    source='dispatchJob'
    label='Dispatched'
    fieldName='dispatchJob'
    key='dispatch'
    resource={constants.R_ITEMS}
  />
]

const ItemActions = (): React.ReactElement => {
  return (
    <TopToolbar>
      <ItemAssetReport storeKey='items-asset-report' />
      <FilterButton />
      <SelectColumnsButton />
    </TopToolbar>
  )
}

const getItemStates = (
  selectedIds: number[],
  data: Item[]
): Record<string, any> => {
  if (selectedIds.length === 0) {
    return [false, false, false]
  } else {
    const filteredData = data.filter((item) => selectedIds.includes(item.id))
    return {
      noneLoanedVal: filteredData.every((f) => f.loanedTo === undefined),
      allLoanedVal: filteredData.every((f) => f.loanedTo !== undefined),
      anyDestructed: filteredData.some((f) => f.destruction !== undefined),
      anyLoaned: filteredData.some((f) => f.loanedTo !== undefined),
      anyDispatched: filteredData.some((f) => f.dispatchJob !== undefined)
    }
  }
}

type ModalOpenType =
  | 'destroy'
  | 'location'
  | ''
  | 'loan'
  | 'destroyRemove'
  | 'dispatch'
  | 'isReturn'
  | 'dispatchRemove'

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

interface BulkActionsProps {
  buttons?: PartialRecord<ModalOpenType, boolean>
}

export const BulkActions = (props: BulkActionsProps): React.ReactElement => {
  const { buttons } = props

  const {
    location = true,
    loan = true,
    destroyRemove = false,
    dispatchRemove = false,
    destroy = true,
    dispatch = true,
    isReturn = false
  } = buttons ?? {
    destroy: true,
    location: true,
    loan: true,
    destroyRemove: false,
    dispatchRemove: false,
    dispatch: true,
    isReturn: false
  }

  const { selectedIds } = useListContext<Item>()
  const { data = [] } = useGetMany<Item>(constants.R_ITEMS, {
    ids: selectedIds
  })
  const [open, setOpen] = useState<ModalOpenType>('')
  const refresh = useRefresh()
  const [noneLoaned, setNoneLoaned] = useState(false)
  const [allLoaned, setAllLoaned] = useState(false)
  const [isDestruction, setIsDestruction] = useState(false)
  const [isAnyLoaned, setIsAnyLoaned] = useState(false)
  const [isAnyDispatched, setIsAnyDispatched] = useState(false)

  const audit = useAudit()
  const dataProvider = useDataProvider()
  const notify = useNotify()

  const { hasAccess } = useCanAccess()

  useEffect(() => {
    const {
      noneLoanedVal,
      allLoanedVal,
      anyDestructed,
      anyLoaned,
      anyDispatched
    } = getItemStates(selectedIds, data)
    setNoneLoaned(noneLoanedVal)
    setAllLoaned(allLoanedVal)
    setIsDestruction(anyDestructed)
    setIsAnyLoaned(anyLoaned)
    setIsAnyDispatched(anyDispatched)
  }, [selectedIds, data])

  const handleClose = (): void => {
    setOpen('')
  }

  const handleOpen = (type: ModalOpenType): (() => void) => {
    return () => {
      setOpen(type)
    }
  }

  const handleSuccess = (): void => {
    handleClose()
    refresh()
  }

  const removeFromDispatch = async (): Promise<void> => {
    selectedIds.map(async (itemId) => {
      const auditData = {
        type: AuditType.EDIT,
        activityDetail: 'Item returned',
        securityRelated: false,
        dataId: itemId,
        resource: constants.R_DISPATCH
      }
      await audit(auditData)
      await audit({
        ...auditData,
        activityDetail: 'Dispatched Item returned',
        resource: constants.R_ITEMS
      })
    })

    await dataProvider.updateMany<Item>(constants.R_ITEMS, {
      ids: selectedIds,
      data: {
        dispatchJob: undefined
      }
    })
    notify(`${selectedIds.length} items removed from dispatch job`)
    refresh()
  }

  const returnDispatchedItems = async (): Promise<void> => {
    selectedIds.map(async (itemId) => {
      const auditData = {
        type: AuditType.EDIT,
        activityDetail: 'Item returned',
        securityRelated: false,
        dataId: itemId,
        resource: constants.R_DISPATCH
      }
      await audit(auditData)
      await audit({
        ...auditData,
        activityDetail: 'Dispatched Item returned',
        resource: constants.R_ITEMS
      })
    })

    await dataProvider.updateMany<Item>(constants.R_ITEMS, {
      ids: selectedIds,
      data: {
        dispatchJob: undefined,
        dispatchedDate: undefined
      }
    })
    refresh()
  }

  const ReturnButton = (): React.ReactElement => {
    return (
      <>
        {isReturn ? (
          <Button
            onClick={returnDispatchedItems as any}
            size='small'
            variant='outlined'>
            Return
          </Button>
        ) : (
          <Button
            onClick={removeFromDispatch as any}
            size='small'
            variant='outlined'>
            Remove
          </Button>
        )}
      </>
    )
  }

  const isItemNormal = !isDestruction && !isAnyLoaned && !isAnyDispatched

  return (
    <>
      {isItemNormal && hasAccess(constants.R_ITEMS, { write: true }) && (
        <>
          {dispatch ? (
            <FlexBox>
              <Button
                onClick={handleOpen('dispatch')}
                size='small'
                variant='outlined'>
                Dispatch
              </Button>
            </FlexBox>
          ) : null}
          {destroy ? (
            <FlexBox>
              <Button
                startIcon={<DeleteSweepIcon />}
                onClick={handleOpen('destroy')}
                size='small'
                variant='outlined'>
                Destroy
              </Button>
            </FlexBox>
          ) : null}
          {location ? (
            <FlexBox>
              <Button
                size='small'
                variant='outlined'
                onClick={handleOpen('location')}>
                Change Location
              </Button>
            </FlexBox>
          ) : null}
        </>
      )}
      {!isDestruction &&
      !isAnyDispatched &&
      loan &&
      hasAccess(constants.R_ITEMS, { write: true }) ? (
        <LoanItemsListBulkActionButtons
          noneLoaned={noneLoaned}
          allLoaned={allLoaned}
        />
      ) : null}
      {!isItemNormal && (
        <>
          {destroyRemove ? (
            <FlexBox>
              <Button
                startIcon={<RestoreFromTrash />}
                onClick={handleOpen('destroyRemove')}
                size='small'
                variant='outlined'>
                Remove
              </Button>
            </FlexBox>
          ) : null}
          {dispatchRemove ? <ReturnButton /> : null}
        </>
      )}

      <Modal open={Boolean(open)} onClose={handleClose}>
        <>
          {open === 'location' && (
            <ChangeLocation
              successCallback={handleSuccess}
              onCancel={handleClose}
              ids={selectedIds}
            />
          )}
          {open === 'destroy' && (
            <DestroyItems
              ids={selectedIds}
              data={data}
              onClose={handleClose}
              successCallback={handleSuccess}
            />
          )}
          {open === 'destroyRemove' && (
            <DestroyRestoreItems
              ids={selectedIds}
              data={data}
              onClose={handleClose}
              successCallback={handleSuccess}
            />
          )}
          {open === 'dispatch' && (
            <DispatchItems
              ids={selectedIds}
              data={data}
              onClose={handleClose}
              successCallback={handleSuccess}
            />
          )}
        </>
      </Modal>
    </>
  )
}

interface ItemListType extends Omit<ListProps, 'children'> {
  filter?: FilterPayload
  children?: React.ReactElement
  datagridConfigurableProps?: DatagridConfigurableProps
  filtersShown?: string[]
}

export default function ItemList(props?: ItemListType): React.ReactElement {
  const { options } = useResourceDefinition()
  const {
    datagridConfigurableProps,
    children,
    storeKey = 'items-items-list',
    filtersShown,
    ...rest
  } = props ?? {}

  return (
    <List
      hasCreate={false}
      actions={<ItemActions />}
      resource={constants.R_ITEMS}
      filter={props?.filter ?? options?.filter}
      filters={
        !filtersShown
          ? filters
          : filters.filter((f) => filtersShown.includes(f.key as string))
      }
      storeKey={storeKey}
      {...rest}>
      <ResetDateFilter source='createdAt' />
      {/* <ResetDateRangeFilter source='date_range' /> */}
      {typeof children !== 'undefined' ? (
        children
      ) : (
        <DatagridConfigurableWithShow
          resource={constants.R_ITEMS}
          bulkActionButtons={<BulkActions />}
          omit={omitColumns}>
          <TextField source='item_number' label='Reference' />
          <TextField source='id' />
          <TextField source='createdAt' label='Created' />
          <SourceField
            link='show'
            source='mediaType'
            reference={constants.R_MEDIA_TYPE}
            label='Media type'
          />
          <SourceField
            link='show'
            source='loanedTo'
            reference={constants.R_USERS}
            label='Loaned to'
          />
          <DateField showTime source='startDate' />
          <DateField showTime source='endDate' />
          <SourceField source='vaultLocation' reference='vaultLocation' />
          <SourceField
            source='protectiveMarking'
            reference='protectiveMarking'
          />
          <SourceField
            link='show'
            source='batchId'
            reference={constants.R_BATCHES}
            sourceField='batchNumber'
          />
          <SourceField
            link='show'
            source='destruction'
            reference={constants.R_DESTRUCTION}
            sourceField='reference'
          />
          <DateField source='destructionDate' />
          <SourceField
            link='show'
            source='dispatchJob'
            reference={constants.R_DISPATCH}
            sourceField='reference'
            label='Dispatch Job'
          />
          <DateField source='dispatchedDate' />
          <TextField source='remarks' />
          <TextField source='musterRemarks' />
        </DatagridConfigurableWithShow>
      )}
    </List>
  )
}
