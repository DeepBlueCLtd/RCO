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
  TextField,
  FunctionField,
  ReferenceField
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
import { useLocation } from 'react-router-dom'
import useItemList from '../../hooks/useItemList'
import { useConfigData } from '../../utils/useConfigData'
import NullUndefinedFilter from '../../components/NullUndefinedFilter'

const sort = (field = 'name'): SortPayload => ({ field, order: 'ASC' })

const omitColumns: Array<keyof RichItem> = [
  'id',
  'createdAt',
  'createdBy',
  'remarks',
  'startDate',
  'endDate',
  'vaultLocation',
  'musterRemarks',
  'loanedTo',
  'batch',
  'protectionString',
  'destruction',
  'dispatchJob',
  'legacyMediaType',
  'department',
  'vault'
]

const getFilters = (
  resource?: string,
  projectLabel?: string
): React.ReactElement[] => {
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
    <SourceInput
      key='legacyMediaType'
      source='legacyMediaType'
      reference={constants.R_MEDIA_TYPE}
      label='Legacy Media Type'
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
    <SourceInput
      reference={constants.R_DEPARTMENT}
      key='department'
      sort={sort()}
      source='department'
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
    />,
    <SourceInput
      source='project'
      key='project'
      label={projectLabel}
      inputProps={{ label: projectLabel }}
      sort={sort('id')}
      reference={constants.R_PROJECTS}
      optionField='name'
    />,
    <SourceInput
      source='platform'
      key='platform'
      sort={sort('id')}
      reference={constants.R_PLATFORMS}
      optionField='name'
    />
  ]
  if (resource === constants.R_ALL_ITEMS) {
    filters.push(
      <NullUndefinedFilter
        source={
          process.env.MOCK ? 'destructionDate_neq' : 'destructionDate__notnull'
        }
        label='Destroyed'
        key='Destruction'
      />,
      <NullUndefinedFilter
        source={
          process.env.MOCK ? 'dispatchedDate_neq' : 'dispatchedDate__notnull'
        }
        label='Dispatched'
        key='Dispatch'
      />
    )
  } else if (resource === constants.R_ITEMS) {
    filters.push(
      <BooleanFilter<Item>
        source='destruction'
        label='Marked for destruction'
        fieldName='destruction'
        key='destruction'
        resource={constants.R_ITEMS}
      />,
      <BooleanFilter<Item>
        source='dispatchJob'
        label='Marked for dispatch'
        fieldName='dispatchJob'
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
  const { filter, preferenceKey } = props
  return (
    <StyledTopToolbar>
      <ItemAssetReport
        storeKey='items-asset-report'
        filterDefaultValues={filter}
      />
      <FilterButton />
      <SelectColumnsButton preferenceKey={preferenceKey} />
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
      noneLoanedVal: filteredData.every(
        (f) => f.loanedTo === undefined || f.loanedTo === null
      ),
      allLoanedVal: filteredData.every(
        (f) => f.loanedTo !== undefined && f.loanedTo !== null
      ),
      anyDestructed: filteredData.some(
        (f) => f.destruction !== undefined && f.destruction !== null
      ),
      anyPendingDestruction: filteredData.some(
        (f) =>
          f.destruction !== undefined &&
          f.destruction !== null &&
          (f.destructionDate === undefined || f.destructionDate === null)
      ),
      anyLoaned: filteredData.some(
        (f) => f.loanedTo !== undefined && f.loanedTo !== null
      ),
      anyDispatched: filteredData.some(
        (f) => f.dispatchedDate !== undefined && f.dispatchedDate !== null
      ),
      anyPendingDispatch: filteredData.some(
        (f) =>
          f.dispatchJob !== undefined &&
          f.dispatchJob !== null &&
          (f.dispatchedDate === undefined || f.dispatchedDate === null)
      ),
      allDispatched: filteredData.every(
        (f) => f.dispatchedDate !== undefined && f.dispatchedDate !== null
      )
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

  const { selectedIds } = useListContext<RichItem>()
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
  const [isAnyPendingDispatch, setIsAnyPendingDispatch] = useState(false)
  const [isAnyPendingDestruction, setIsAnyPendingDestruction] = useState(false)
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
      anyPendingDestruction,
      anyLoaned,
      anyDispatched,
      anyPendingDispatch,
      allDispatched
    } = getItemStates(selectedIds, data)
    setNoneLoaned(noneLoanedVal)
    setAllLoaned(allLoanedVal)
    setIsAnyPendingDestruction(anyPendingDestruction)
    setIsDestruction(anyDestructed)
    setIsAnyLoaned(anyLoaned)
    setIsAnyPendingDispatch(anyPendingDispatch)
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
      const { data } = await dataProvider.getOne<Item>(constants.R_ITEMS, {
        id: itemId
      })

      const auditData = {
        activityType: AuditType.EDIT,
        activityDetail: 'Item removed',
        securityRelated: false,
        // TODO: TAHA - the next line should be the id of the dispatch (not the item)
        dataId: data.dispatchJob,
        resource: constants.R_DISPATCH,
        subjectId: itemId,
        subjectResource: constants.R_ITEMS
      }
      await audit(auditData)
      await audit({
        ...auditData,
        activityDetail: 'Dispatch Item removed',
        resource: constants.R_ITEMS,
        // TODO: TAHA - the subject for this is the dispatch id, and R_DISPATCH
        subjectId: data.dispatchJob,
        subjectResource: constants.R_DISPATCH
      })
    })

    await dataProvider.updateMany<Item>(constants.R_ITEMS, {
      ids: selectedIds,
      data: {
        dispatchJob: null
      }
    })
    notify(`${selectedIds.length} items removed from dispatch`)
    refresh()
  }

  const returnDispatchedItems = async (): Promise<void> => {
    selectedIds.map(async (itemId) => {
      const { data } = await dataProvider.getOne<Item>(constants.R_ITEMS, {
        id: itemId
      })
      const auditData = {
        activityType: AuditType.RETURN,
        activityDetail: 'Item returned',
        securityRelated: false,
        dataId: data.dispatchJob,
        resource: constants.R_DISPATCH,
        subjectId: itemId,
        subjectResource: constants.R_ITEMS
      }
      await audit(auditData)
      await audit({
        ...auditData,
        activityType: AuditType.RETURN,
        activityDetail: 'Dispatched Item returned',
        resource: constants.R_ITEMS,
        dataId: itemId,
        subjectId: data.dispatchJob,
        subjectResource: constants.R_DISPATCH
      })
    })

    await dataProvider.updateMany<Item>(constants.R_ITEMS, {
      ids: selectedIds,
      data: {
        dispatchJob: null,
        dispatchedDate: null
      }
    })

    notify(`${selectedIds.length} items returned`, { type: 'success' })
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

  const isItemNormal =
    !isDestruction &&
    !isAnyLoaned &&
    !isAnyDispatched &&
    !isAnyPendingDispatch &&
    !isAnyPendingDestruction
  const bulkActionsStyle = {
    display: 'flex',
    marginLeft: 2
  }

  const canBeLoaned =
    !isDestruction && !isAnyDispatched && loan && !isAnyPendingDispatch
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
  const filterInSearch = searchParams.get('filter')
  const [projectName, setProjectName] = useState<undefined | string>(undefined)
  const [key, setKey] = useState(0)

  const sKey = filterInSearch ? 'filtered-item-list' : 'items-items-list'
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
  const configData = useConfigData()

  const sx = {
    '& .MuiToolbar-root': {
      '& > form': {
        flex: 1
      }
    }
  }
  useEffect(() => {
    localStorage.removeItem('RaStore.items-items-list');
    localStorage.removeItem("RaStore.richItem.selectedIds")
  }, [location.pathname]);

  useEffect(() => {
    if (configData?.projectName) {
      setProjectName(configData.projectName)
      setKey((prev) => prev + 1)
    }
  }, [configData?.projectName])

  return (
    <List
      key={key}
      {...(filterInSearch
        ? { disableSyncWithLocation: false }
        : { disableSyncWithLocation: true })}
      sx={sx}
      hasCreate={false}
      actions={<ItemActions preferenceKey={preferenceKey} filter={filter} />}
      resource={constants.R_RICH_ITEMS}
      filter={props?.filter ?? options?.filter}
      sort={options?.sort}
      perPage={100}
      pagination={<Pagination rowsPerPageOptions={[10, 25, 50, 100]} />}
      filters={
        !filtersShown
          ? getFilters(resource, configData?.projectName)
          : getFilters(resource, configData?.projectName).filter((f) =>
              filtersShown.includes(f.key as string)
            )
      }
      storeKey={storeKey ?? `${options.resource}-store-key`}
      {...rest}>
      <ItemListData
        bulkActionButtons={bulkActionButtons}
        preferenceKey={preferenceKey}
        resource={resource}
        storeKey={storeKey}
        projectName={projectName}
      />
    </List>
  )
}

interface Props {
  preferenceKey: string
  bulkActionButtons:
    | false
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | undefined
  resource: string
  storeKey: string | false
  projectName?: string
}

const ItemListData = ({
  preferenceKey,
  bulkActionButtons,
  resource,
  storeKey,
  projectName
}: Props): React.ReactElement => {
  const { users, vaultLocations } = useItemList()
  const CommonEndFields = [
    <TextField<Item> source='remarks' key={'remarks'} />,
    <TextField<Item> source='musterRemarks' key={'musterRemarks'} />,
    <TextField<Item>
      source='protectionString'
      label='Protection'
      key={'protectionString'}
    />
  ]
  return (
    <>
      <ResetDateFilter source='createdAt' />
      <ResetDateRangeFilter
        source='date_range'
        startSource='endDate_gte'
        endSource='startDate_lte'
      />
      <DatagridConfigurableWithShow
        resource={constants.R_RICH_ITEMS}
        storeKey={storeKey}
        bulkActionButtons={
          bulkActionButtons ?? <BulkActions preferenceKey={preferenceKey} />
        }
        preferenceKey={preferenceKey}
        omit={omitColumns}>
        <FunctionField<RichItem>
          label='Reference'
          render={(record) => `${record.vault?.[0]}${record.itemNumber}`}
        />
        <TextField<RichItem> source='id' />
        <TextField<RichItem> source='createdAt' label='Created At' />
        <SourceField<Batch> source='createdBy' reference={constants.R_USERS} />
        <FunctionField<RichItem>
          label='Location'
          render={(record) => {
            if (record.loanedTo) {
              return users?.[record.loanedTo]?.name
            } else if (record.destructionDate !== null) {
              return 'DESTROYED'
            } else if (record.destruction !== null) {
              return 'DEST (PENDING)'
            } else if (record.dispatchedDate !== null) {
              return 'SENT'
            } else if (record.dispatchJob !== null) {
              return 'SENT (PENDING)'
            } else
              return (
                record.vaultLocation &&
                vaultLocations?.[record.vaultLocation]?.name
              )
          }}
        />
        <SourceField<RichItem>
          link={false}
          source='mediaType'
          reference={constants.R_MEDIA_TYPE}
          label='Media type'
        />
        <SourceField<Item>
          link={false}
          source='legacyMediaType'
          reference={constants.R_MEDIA_TYPE}
          label='Legacy Media type'
        />
        <SourceField<RichItem>
          link='show'
          source='loanedTo'
          reference={constants.R_USERS}
          label='Loaned to'
        />
        <DateField<RichItem> showTime source='startDate' />
        <DateField<RichItem> showTime source='endDate' />
        <SourceField<RichItem>
          link={false}
          source='vaultLocation'
          reference={constants.R_VAULT_LOCATION}
        />
        <SourceField<RichItem>
          source='protectiveMarking'
          reference={constants.R_PROTECTIVE_MARKING}
        />
        <ReferenceField<RichItem>
          link={false}
          reference={constants.R_BATCHES}
          source='batch'>
          <FunctionField<Batch>
            render={(record) => `${record.vault?.[0]}-${record.batchNumber}`}
          />
        </ReferenceField>
        <SourceField<RichItem>
          link='show'
          source='platform'
          reference={constants.R_PLATFORMS}
        />
        <SourceField<RichItem>
          source='department'
          label='Department'
          reference={constants.R_DEPARTMENT}
        />
        <SourceField<RichItem>
          source='vault'
          label='Vault'
          reference={constants.R_VAULT}
        />
        {projectName && (
          <SourceField<RichItem>
            link={false}
            source='project'
            label={projectName}
            reference={constants.R_PROJECTS}
          />
        )}

        {resource !== constants.R_RICH_ITEMS
          ? [
              <SourceField<RichItem>
                link={false}
                source='destruction'
                reference={constants.R_DESTRUCTION}
                sourceField='name'
                key={'destruction'}
              />,
              <DateField<RichItem>
                source='destructionDate'
                key={'destructionDate'}
              />,
              <SourceField<RichItem>
                link={false}
                source='dispatchJob'
                reference={constants.R_DISPATCH}
                sourceField='name'
                label='Dispatch'
                key={'dispatchJob'}
              />,
              <DateField<RichItem>
                source='dispatchedDate'
                key={'dispatchJob'}
              />,
              ...CommonEndFields
            ]
          : CommonEndFields}
        {/* <SourceField source='project' reference={constants.R_PROJECTS} /> */}
        {/* <SourceField source='platform' reference={constants.R_PLATFORMS} /> */}
      </DatagridConfigurableWithShow>
    </>
  )
}
