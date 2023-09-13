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
        <ConditionalDateField label='Dispatched At' source='dispatchedAt' />
        <TextField<Dispatch> source='toName' />
        <TextField<Dispatch> source='remarks' />
        <TextField<Dispatch> source='receiptReceived' />
      </Datagrid>
    </List>
  )
}

export const ConditionalDateField = ({
  label,
  source
}: {
  label: string
  source: string
}): React.ReactElement => {
  const dispatch = useRecordContext<Dispatch>()

  return dispatch.dispatchedAt !== 'null' ? (
    <DateField source={source} label={label} />
  ) : (
    <></>
  )
}
