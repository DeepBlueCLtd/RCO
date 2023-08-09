import {
  FilterButton,
  type ListProps,
  SearchInput,
  SelectColumnsButton,
  TextInput,
  useListContext,
  useRefresh,
  type SortPayload,
  type FilterPayload,
  type DatagridConfigurableProps,
  useDataProvider,
  useResourceDefinition,
  useNotify,
  useGetMany,
  Pagination,
  type SelectColumnsButtonProps,
  DateField,
  TextField
} from 'react-admin'
import SourceInput from '../../components/SourceInput'
import * as constants from '../../constants'
import CreatedByMeFilter from '../../components/CreatedByMeFilter'
import { ItemAssetReport } from './ItemsReport'
import { Box, Button, Modal } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import FlexBox from '../../components/FlexBox'
import ChangeLocation from './ItemForm/ChangeLocation'
import DateFilter, { ResetDateFilter } from '../../components/DateFilter'
import LoanItemsListBulkActionButtons from './LoanItemsListBulkActionButtons'
import DateRangePicker, {
  ResetDateRangeFilter
} from '../../components/DateRangePicker'
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
import StyledTopToolbar from '../../components/StyledTopToolbar'
import SourceField from '../../components/SourceField'
import LocationField from './LocationField'
import ItemListData, { type DataType } from './ItemListData'
import { useLocation } from 'react-router-dom'

const sort = (field = 'name'): SortPayload => ({ field, order: 'ASC' })

const omitColumns: Array<keyof Item> = [
  'id',
  'createdAt',
  'remarks',
  'startDate',
  'endDate',
  'vaultLocation',
  'musterRemarks',
  'loanedTo',
  'batch',
  'protectionString'
  // 'project',
  // 'platform'
]

const getFilters = (resource?: string): React.ReactElement[] => {
  const filters = [
    // <SourceInput
    //   source='platform'
    //   key='platform'
    //   reference={constants.R_PLATFORMS}
    // />,
    // <SourceInput
    //   source='project'
    //   key='project'
    //   reference={constants.R_PROJECTS}
    // />,
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
    <TextInput source='itemNumber' key='itemNumber' label='Reference' />,
    <SourceInput
      key='mediaType'
      source='mediaType'
      reference={constants.R_MEDIA_TYPE}
    />,
    <DateRangePicker
      startSource='endDate_gte'
      endSource='startDate_lte'
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
      reference={constants.R_VAULT_LOCATION}
    />,
    <SourceInput
      source='protectiveMarking'
      key='protectiveMarking'
      sort={sort()}
      reference={constants.R_PROTECTIVE_MARKING}
    />,
    <SourceInput
      source='batch'
      key='batch'
      sort={sort('batchNumber')}
      reference={constants.R_BATCHES}
      optionField='batchNumber'
    />,
    <TextInput key='remarks' source='remarks' />,
    <DateFilter
      source='createdAt'
      label='Created At'
      key='createdAt'
      format='iso'
    />,
    <BooleanFilter<Item>
      source='id'
      label='On loan'
      fieldName='loanedTo'
      key='loaned'
      resource={constants.R_ITEMS}
    />
  ]
  if (resource === constants.R_ALL_ITEMS) {
    filters.push(
      <BooleanFilter<Item>
        source='destructionDate'
        label='Destroyed'
        fieldName='destructionDate'
        key='destruction'
        resource={constants.R_ITEMS}
      />,
      <BooleanFilter<Item>
        source='dispatchedDate'
        label='Dispatched'
        fieldName='dispatchedDate'
        key='dispatch'
        resource={constants.R_ITEMS}
      />
    )
  }
  return filters
}

interface ItemActionsProps {
  preferenceKey: string
  filter?: FilterPayload
}

const ItemActions = (props: ItemActionsProps): React.ReactElement => {
  const { filter } = props
  return (
    <StyledTopToolbar {...props}>
      <ItemAssetReport
        storeKey='items-asset-report'
        filterDefaultValues={filter}
      />
      <FilterButton />
      <SelectColumnsButton {...props} />
    </StyledTopToolbar>
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
      anyDispatched: filteredData.some((f) => f.dispatchJob !== undefined),
      allDispatched: filteredData.every((f) => f.dispatchedDate !== undefined)
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
  | 'dispatchRemove'

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

interface BulkActionsProps {
  buttons?: PartialRecord<ModalOpenType, boolean>
  preferenceKey?: string
}

export const BulkActions = (props: BulkActionsProps): React.ReactElement => {
  const { buttons } = props

  const {
    location = true,
    loan = true,
    destroyRemove = false,
    dispatchRemove = false,
    destroy = true,
    dispatch = true
  } = buttons ?? {
    destroy: true,
    location: true,
    loan: true,
    destroyRemove: false,
    dispatchRemove: false,
    dispatch: true
  }

  const { selectedIds } = useListContext<Item>()
  const isSelected = selectedIds.length > 0
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
  const [isAllDispatched, setIsAllDispatched] = useState(false)

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
      anyDispatched,
      allDispatched
    } = getItemStates(selectedIds, data)
    setNoneLoaned(noneLoanedVal)
    setAllLoaned(allLoanedVal)
    setIsDestruction(anyDestructed)
    setIsAnyLoaned(anyLoaned)
    setIsAnyDispatched(anyDispatched)
    setIsAllDispatched(allDispatched)
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
        activityType: AuditType.EDIT,
        activityDetail: 'Item removed',
        securityRelated: false,
        dataId: itemId,
        resource: constants.R_DISPATCH,
        // TODO: put the item number in for subject
        subjectId: null,
        subjectResource: null
      }
      await audit(auditData)
      await audit({
        ...auditData,
        activityDetail: 'Dispatch Item removed',
        resource: constants.R_ITEMS
      })
    })

    await dataProvider.updateMany<Item>(constants.R_ITEMS, {
      ids: selectedIds,
      data: {
        dispatchJob: undefined
      }
    })
    notify(`${selectedIds.length} items removed from dispatch`)
    refresh()
  }

  const returnDispatchedItems = async (): Promise<void> => {
    selectedIds.map(async (itemId) => {
      const auditData = {
        activityType: AuditType.EDIT,
        activityDetail: 'Item returned',
        securityRelated: false,
        dataId: itemId,
        resource: constants.R_DISPATCH,
        // TODO: include the item as subject
        subjectId: null,
        subjectResource: null
      }
      await audit(auditData)
      await audit({
        ...auditData,
        activityType: AuditType.RETURN,
        activityDetail: 'Dispatched Item returned',
        resource: constants.R_ITEMS,
        // TODO: include the dispatch as subject
        subjectId: null,
        subjectResource: null
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
    const { canReturn, canRemove } = {
      canReturn: isAllDispatched && isSelected,
      canRemove: dispatchRemove
    }
    return (
      <>
        <Button
          disabled={!canReturn}
          onClick={returnDispatchedItems as any}
          size='small'
          variant='outlined'>
          Return
        </Button>
        {canRemove && (
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
  const bulkActionsStyle = {
    display: 'flex',
    marginLeft: 2
  }

  const canBeLoaned = !isDestruction && !isAnyDispatched && loan
  const disableLoanItemsBulkActions = !(
    canBeLoaned &&
    hasAccess(constants.R_ITEMS, { write: true }) &&
    isSelected
  )

  const normalWithWriteAccess =
    isItemNormal && hasAccess(constants.R_ITEMS, { write: true }) && isSelected
  const { disableDispatch, disableDestroy, disableChangeLocation } = useMemo(
    () => ({
      disableDispatch: !(normalWithWriteAccess && dispatch),
      disableDestroy: !(normalWithWriteAccess && destroy),
      disableChangeLocation: !(normalWithWriteAccess && location)
    }),
    [normalWithWriteAccess]
  )

  return (
    <Box sx={[bulkActionsStyle, { width: '100vw' }]}>
      <Box
        sx={{
          display: 'flex',
          gap: 1
        }}>
        <FlexBox>
          <Button
            disabled={disableDispatch}
            onClick={handleOpen('dispatch')}
            size='small'
            variant='outlined'>
            Dispatch
          </Button>
        </FlexBox>
        <FlexBox>
          <Button
            disabled={disableDestroy}
            startIcon={<DeleteSweepIcon />}
            onClick={handleOpen('destroy')}
            size='small'
            variant='outlined'>
            Destroy
          </Button>
        </FlexBox>
        <FlexBox>
          <Button
            disabled={disableChangeLocation}
            size='small'
            variant='outlined'
            onClick={handleOpen('location')}>
            Change Location
          </Button>
        </FlexBox>
        <LoanItemsListBulkActionButtons
          disabled={disableLoanItemsBulkActions}
          noneLoaned={noneLoaned}
          allLoaned={allLoaned}
        />
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
          </>
        )}
        <ReturnButton />

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
      </Box>
    </Box>
  )
}

interface ItemListType extends Omit<ListProps, 'children'> {
  filter?: FilterPayload
  children?: React.ReactElement
  datagridConfigurableProps?: DatagridConfigurableProps
  filtersShown?: string[]
}

export default function ItemList(
  props?: ItemListType & SelectColumnsButtonProps
): React.ReactElement {
  const { options } = useResourceDefinition()
  const { resource } = options ?? {}
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const sKey = searchParams.get('filter')
    ? 'filtered-item-list'
    : 'items-items-list'
  const {
    datagridConfigurableProps,
    children,
    storeKey = sKey,
    filtersShown,
    preferenceKey = `${constants.R_ITEMS}-items-datagrid-columns`,
    bulkActionButtons,
    filter,
    ...rest
  } = props ?? {}

  const sx = {
    '& .MuiToolbar-root': {
      '& > form': {
        flex: 1
      }
    }
  }
  const [data, setData] = useState<DataType>()
  const CommonEndFields = [
    <TextField source='remarks' key={'remarks'} />,
    <TextField source='musterRemarks' key={'musterRemarks'} />,
    <TextField
      source='protectionString'
      label='Protection'
      key={'protectionString'}
    />
  ]
  return (
    <List
      disableSyncWithLocation
      sx={sx}
      hasCreate={false}
      actions={<ItemActions preferenceKey={preferenceKey} filter={filter} />}
      resource={constants.R_ITEMS}
      filter={props?.filter ?? options?.filter}
      sort={options?.sort}
      perPage={100}
      pagination={<Pagination rowsPerPageOptions={[10, 25, 50, 100]} />}
      filters={
        !filtersShown
          ? getFilters(resource)
          : getFilters(resource).filter((f) =>
              filtersShown.includes(f.key as string)
            )
      }
      storeKey={storeKey ?? `${options.resource}-store-key`}
      {...rest}>
      <ItemListData setData={setData} />
      <ResetDateFilter source='createdAt' />
      <ResetDateRangeFilter
        source='date_range'
        startSource='endDate_gte'
        endSource='startDate_lte'
      />
      <DatagridConfigurableWithShow
        resource={constants.R_ITEMS}
        storeKey={storeKey}
        bulkActionButtons={
          bulkActionButtons ?? <BulkActions preferenceKey={preferenceKey} />
        }
        preferenceKey={preferenceKey}
        omit={omitColumns}>
        <TextField source='itemNumber' label='Reference' />
        <TextField source='id' />
        <TextField source='createdAt' label='Created' />
        <LocationField label='Location' {...data} />
        <SourceField
          link={false}
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
        <SourceField
          link={false}
          source='vaultLocation'
          reference={constants.R_VAULT_LOCATION}
        />
        <SourceField
          source='protectiveMarking'
          reference={constants.R_PROTECTIVE_MARKING}
        />
        <SourceField
          link={false}
          source='batch'
          reference={constants.R_BATCHES}
          sourceField='batchNumber'
        />

        {resource !== constants.R_ITEMS
          ? [
              <SourceField
                link={false}
                source='destruction'
                reference={constants.R_DESTRUCTION}
                sourceField='reference'
                key={'destruction'}
              />,
              <DateField source='destructionDate' key={'destructionDate'} />,
              <SourceField
                link={false}
                source='dispatchJob'
                reference={constants.R_DISPATCH}
                sourceField='reference'
                label='Dispatch'
                key={'dispatchJob'}
              />,
              <DateField source='dispatchedDate' key={'dispatchJob'} />,
              ...CommonEndFields
            ]
          : CommonEndFields}
        {/* <SourceField source='project' reference={constants.R_PROJECTS} /> */}
        {/* <SourceField source='platform' reference={constants.R_PLATFORMS} /> */}
      </DatagridConfigurableWithShow>
    </List>
  )
}
