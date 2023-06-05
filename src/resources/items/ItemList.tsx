import {
  DatagridConfigurable,
  DateField,
  FilterButton,
  List,
  type ListProps,
  SearchInput,
  SelectColumnsButton,
  TextField,
  TextInput,
  TopToolbar,
  useListContext,
  useRefresh,
  AutocompleteInput,
  type SortPayload,
  useGetList,
  type FilterPayload,
  type DatagridConfigurableProps,
  useDataProvider
} from 'react-admin'
import SourceField from '../../components/SourceField'
import SourceInput from '../../components/SourceInput'
import { mediaTypeOptions } from '../../utils/options'
import * as constants from '../../constants'
import CreatedByMeFilter from '../../components/CreatedByMeFilter'
import { ItemAssetReport } from './ItemsReport'
import { Button, Chip, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FlexBox from '../../components/FlexBox'
import ChangeLocation from './ItemForm/ChangeLocation'
import DateFilter, { ResetDateFilter } from '../../components/DateFilter'
import LoanItemsListBulkActionButtons from './LoanItemsListBulkActionButtons'
import DateRangePicker from '../../components/DateRangePicker'
import useCanAccess from '../../hooks/useCanAccess'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import DestroyItems from './DestroyItems'
import DispatchItems from './DispatchItems'
import { RestoreFromTrash } from '@mui/icons-material'
import DestroyRestoreItems from './DestroyRestoreItems'
import { AuditType } from '../../utils/activity-types'
import useAudit from '../../hooks/useAudit'

const sort = (field = 'name'): SortPayload => ({ field, order: 'ASC' })

const omitColumns: string[] = [
  'id',
  'createdAt',
  'remarks',
  'start',
  'end',
  'vaultLocation',
  'musterRemarks',
  'loanedTo'
]

interface Props {
  source: string
  label: string
}

const OnLoanFilter = ({ source, label }: Props): React.ReactElement => {
  const { setFilters, displayedFilters } = useListContext()
  const { data } = useGetList<Item>(constants.R_ITEMS, {
    sort: { field: 'id', order: 'ASC' }
  })
  useEffect(() => {
    if (data !== undefined) {
      const filteredIds = data
        .filter((d) => d.loanedTo !== undefined)
        .map((f) => f.id)
      if (filteredIds.length > 0)
        setFilters(
          {
            ...displayedFilters,
            [source]: filteredIds
          },
          displayedFilters
        )
    }
  }, [data])

  return <Chip sx={{ marginBottom: 1 }} label={label} />
}

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
  <AutocompleteInput
    source='mediaType'
    key='mediaType'
    choices={mediaTypeOptions}
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
  <OnLoanFilter source='id' label='On loan' key='loaned' />
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
      anyLoaned: filteredData.some((f) => f.loanedTo !== undefined)
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

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

interface BulkActionsProps {
  buttons?: PartialRecord<ModalOpenType, boolean>
}

export const BulkActions = (props: BulkActionsProps): React.ReactElement => {
  const { buttons } = props

  const {
    destroy = true,
    location = true,
    loan = true,
    destroyRemove = false,
    dispatch = true,
    isReturn = false
  } = buttons ?? {
    destroy: true,
    location: true,
    loan: true,
    destroyRemove: false,
    dispatch: true,
    isReturn: false
  }

  const { selectedIds, data } = useListContext<Item>()
  const [open, setOpen] = useState<ModalOpenType>('')
  const refresh = useRefresh()
  const [noneLoaned, setNoneLoaned] = useState(false)
  const [allLoaned, setAllLoaned] = useState(false)
  const [isDestruction, setIsDestruction] = useState(false)
  const [isAnyLoaned, setIsAnyLoaned] = useState(false)

  const audit = useAudit()
  const dataProvider = useDataProvider()

  const { hasAccess } = useCanAccess()

  useEffect(() => {
    const { noneLoanedVal, allLoanedVal, anyDestructed, anyLoaned } =
      getItemStates(selectedIds, data)
    setNoneLoaned(noneLoanedVal)
    setAllLoaned(allLoanedVal)
    setIsDestruction(anyDestructed)
    setIsAnyLoaned(anyLoaned)
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
        dispatchJob: undefined
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

  return (
    <>
      {!isDestruction && (
        <>
          {hasAccess(constants.R_ITEMS, { write: true }) ? (
            <FlexBox>
              {dispatch ? (
                <Button
                  onClick={handleOpen('dispatch')}
                  size='small'
                  variant='outlined'>
                  Dispatch
                </Button>
              ) : (
                <ReturnButton />
              )}
            </FlexBox>
          ) : null}
          {!isAnyLoaned && hasAccess(constants.R_ITEMS, { write: true }) ? (
            <FlexBox>
              {destroy ? (
                <Button
                  startIcon={<DeleteSweepIcon />}
                  onClick={handleOpen('destroy')}
                  size='small'
                  variant='outlined'>
                  Destroy
                </Button>
              ) : null}
              {destroyRemove ? (
                <Button
                  startIcon={<RestoreFromTrash />}
                  onClick={handleOpen('destroyRemove')}
                  size='small'
                  variant='outlined'>
                  Remove
                </Button>
              ) : null}
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
          {loan && hasAccess(constants.R_ITEMS, { write: true }) ? (
            <LoanItemsListBulkActionButtons
              noneLoaned={noneLoaned}
              allLoaned={allLoaned}
            />
          ) : null}
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
      )}
    </>
  )
}

interface ItemListType extends Omit<ListProps, 'children'> {
  filter?: FilterPayload
  children?: React.ReactElement
  datagridConfigurableProps?: DatagridConfigurableProps
}

export default function ItemList(props?: ItemListType): React.ReactElement {
  const { datagridConfigurableProps, children, ...rest } = props ?? {}
  return (
    <List
      hasCreate={false}
      actions={<ItemActions />}
      resource={constants.R_ITEMS}
      filters={filters}
      filter={props !== undefined ? props.filter : undefined}
      {...rest}>
      <ResetDateFilter source='createdAt' />
      {typeof children !== 'undefined' ? (
        children
      ) : (
        <ItemListDataTable {...datagridConfigurableProps} />
      )}
      {/* <ResetDateRangeFilter source='date_range' /> */}
    </List>
  )
}

function ItemListDataTable(
  props: DatagridConfigurableProps
): React.ReactElement {
  return (
    <DatagridConfigurable
      rowClick='show'
      bulkActionButtons={props?.bulkActionButtons ?? <BulkActions />}
      omit={props?.omit ?? omitColumns}
      {...props}>
      <TextField source='item_number' label='Reference' />
      <TextField source='id' />
      <TextField source='createdAt' label='Created' />
      <TextField source='mediaType' label='Media type' />
      <SourceField
        link='show'
        source='loanedTo'
        reference={constants.R_USERS}
        label='Loaned to'
      />
      <DateField showTime source='start' />
      <DateField showTime source='end' />
      <SourceField source='vaultLocation' reference='vaultLocation' />
      <SourceField source='protectiveMarking' reference='protectiveMarking' />
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
    </DatagridConfigurable>
  )
}
