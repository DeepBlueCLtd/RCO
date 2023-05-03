import {
  List,
  Datagrid,
  DateField,
  TextField,
  DateInput,
  SearchInput
} from 'react-admin'
import CreatedByMeFilter from '../../components/CreatedByMeFilter'
import SourceField from '../../components/SourceField'
import SourceInput from '../../components/SourceInput'
import * as constants from '../../constants'

const filters = [
  <SearchInput key='q' source='q' alwaysOn />,
  <CreatedByMeFilter
    key='createdBy'
    label='Created By Me'
    source='createdBy'
  />,
  <SourceInput key='holder' source='holder' reference={constants.R_USERS} />,
  <SourceInput
    key='loanedBy'
    source='loanedBy'
    reference={constants.R_USERS}
  />,
  <DateInput key='createdAt' source='createdAt' label='Crated At' />
]

export default function LoanList() {
  return (
    <List perPage={25} filters={filters} hasCreate={false}>
      <Datagrid rowClick='show'>
        <SourceField source='createdBy' reference={constants.R_USERS} />
        <SourceField source='holder' reference={constants.R_USERS} />
        <SourceField source='loanedBy' reference={constants.R_USERS} />
        <DateField source='createdAt' label='Created At' />
        <TextField source='remarks' />
      </Datagrid>
    </List>
  )
}
