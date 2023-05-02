import {
  List,
  Datagrid,
  DateField,
  TextField,
  SearchInput,
  DateInput,
  TextInput,
  type ListProps
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

export default function LoanItemsList(props: Omit<ListProps, 'children'>) {
  return (
    <List
      perPage={25}
      empty={false}
      filters={filters}
      resource={constants.R_LOAN_ITEMS}
      actions={<LoanItemListActions />}
      {...props}>
      <Datagrid
        rowClick='show'
        bulkActionButtons={
          <LoanItemsListBulkActionButtons buttons={['loanReturn']} />
        }>
        <DateField source='createdAt' label='Created At' />
        <DateField source='returnedDate' label='Returned Date' />
        <SourceField
          source='item'
          label='Item'
          sourceField='id'
          reference={constants.R_ITEMS}
        />
        <SourceField
          source='loan'
          label='Loan'
          sourceField='id'
          reference={constants.R_LOANS}
        />
        <TextField source='remarks' />
      </Datagrid>
    </List>
  )
}
