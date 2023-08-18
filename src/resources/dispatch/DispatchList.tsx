import {
  Datagrid,
  DateField,
  List,
  TextField,
  type DatagridProps,
  useListContext,
  useDataProvider,
  useNotify,
  useRefresh
} from 'react-admin'
import { Button } from '@mui/material'
import FlexBox from '../../components/FlexBox'
import * as constants from '../../constants'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'
import { useLocation } from 'react-router-dom'

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
    <List hasCreate storeKey={storeKey}>
      <Datagrid
        rowClick='show'
        bulkActionButtons={props.bulkActionButtons ?? <BulkActions />}>
        <TextField source='name' />
        <DateField source='dispatchedAt' />
        <TextField source='toName' />
        <TextField source='remarks' />
        <TextField source='receiptReceived' />
      </Datagrid>
    </List>
  )
}
