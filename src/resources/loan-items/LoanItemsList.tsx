import {
  List,
  Datagrid,
  DateField,
  TextField,
  SearchInput,
  DateInput,
  TextInput
} from 'react-admin'
import SourceField from '../../components/SourceField'
import SourceInput from '../../components/SourceInput'
import * as constants from '../../constants'
import LoanItemListActions from './LoanItemListActions'
import LoanItemsListBulkActionButtons from './LoanItemsListBulkActionButtons'

const filters = [
  <SearchInput key='q' source='q' alwaysOn />,
  <SourceInput key='item' source='item' reference={constants.R_ITEMS} />,
  <SourceInput key='loan' source='loan' reference={constants.R_LOANS} />,
  <SourceInput
    key='receivedBy'
    source='receivedBy'
    reference={constants.R_USERS}
  />,
  <DateInput key='createdAt' source='createdAt' label='Created At' />,
  <DateInput key='returnedDate' source='returnedDate' label='Returned Date' />,
  <TextInput key='remarks' source='remarks' />
]

export default function LoanItemsList() {
  return (
    <List
      perPage={25}
      empty={false}
      filters={filters}
      resource={constants.R_LOAN_ITEMS}
      actions={<LoanItemListActions />}>
      <Datagrid
        rowClick='show'
        bulkActionButtons={<LoanItemsListBulkActionButtons />}>
        <DateField source='createdAt' label='Created At' />
        <DateField source='returnedDate' label='Returned Date' />
        <SourceField
          source='item'
          label='Item'
          sourceField='id'
          reference={constants.R_ITEMS}
        />
        <SourceField source='id' label='Loan' reference={constants.R_LOANS} />
        <SourceField
          source='receivedBy'
          label='Received By'
          reference={constants.R_USERS}
        />
        <TextField source='remarks' />
      </Datagrid>
    </List>
  )
}
