import {
  Datagrid,
  DateField,
  List,
  TextField,
  type DatagridProps,
  useListContext,
  useDataProvider,
  useNotify,
  useRefresh,
  useRecordContext
} from 'react-admin'
import { Button } from '@mui/material'
import FlexBox from '../../components/FlexBox'
import * as constants from '../../constants'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'
import { useLocation } from 'react-router-dom'
import NullUndefinedFilter from '../../components/NullUndefinedFilter'

const filters = [
  <NullUndefinedFilter
    label='Dispatched'
    source={process.env.MOCK ? 'dispatchedAt_neq' : 'dispatchedAt__notnull'}
    key='dispatched'
  />,
  <NullUndefinedFilter
    label='Not Dispatched'
    source={process.env.MOCK ? 'dispatchedAt_eq' : 'dispatchedAt__null'}
    key='not_dispatched'
  />,
  <NullUndefinedFilter
    label='Pending Receipt Note'
    source={process.env.MOCK ? 'receiptReceived_eq' : 'receiptReceived__null'}
    key='receiptPending'
  />
]

const BulkActions = (): React.ReactElement => {
  const { selectedIds } = useListContext<Dispatch>()
  const dataProvider = useDataProvider()
  const refresh = useRefresh()
  const notify = useNotify()

  const receiptReceived = async (): Promise<void> => {
    await dataProvider.updateMany<Dispatch>(constants.R_DISPATCH, {
      ids: selectedIds,
      data: {
        receiptReceived: nowDate()
      }
    })
    refresh()
    notify(`Receipt Received for ${selectedIds.length} items`, {
      type: 'success'
    })
  }

  return (
    <>
      <FlexBox>
        <Button
          onClick={receiptReceived as any}
          size='small'
          variant='outlined'>
          Receipt Note Received
        </Button>
      </FlexBox>
    </>
  )
}

export default function DispatchList(props: DatagridProps): React.ReactElement {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const storeKey = searchParams.get('filter')
    ? 'filtered-dispatch-list'
    : 'simple-dispatch-list'

  return (
    <List hasCreate storeKey={storeKey} filters={filters}>
      <Datagrid
        rowClick='show'
        bulkActionButtons={props.bulkActionButtons ?? <BulkActions />}>
        <TextField<Dispatch> source='name' />
        <TextField<Dispatch> source='toName' />
        <TextField<Dispatch> source='remarks' />
        <ConditionalDateField<Dispatch>
          label='Dispatched At'
          source='dispatchedAt'
          resource={constants.R_DISPATCH}
        />
        <ConditionalDateField<Dispatch>
          label='Receipt Received'
          source='receiptReceived'
          resource={constants.R_DISPATCH}
        />
        <ConditionalDateField<Dispatch>
          label='Last Hastener Sent'
          source='lastHastenerSent'
          resource={constants.R_DISPATCH}
        />
      </Datagrid>
    </List>
  )
}

interface Props<T> {
  label: string
  source: keyof T
  resource: any
}

export const ConditionalDateField = <T extends Dispatch | Destruction>({
  label,
  source,
  resource
}: Props<T>): React.ReactElement => {
  const data = useRecordContext(resource)

  return data[source as string] !== 'null' && !!data[source as string] ? (
    <DateField source={source as string} label={label} />
  ) : (
    <></>
  )
}
