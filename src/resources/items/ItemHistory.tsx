import { Datagrid, DateField, List, TextField } from 'react-admin'
import { useParams } from 'react-router-dom'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import FieldSet from '../../components/FieldSet'

export default function ItemHistory(): React.ReactElement {
  const { id } = useParams()
  return (
    <FieldSet title='History'>
      <List
        resource={constants.R_AUDIT}
        filter={{
          dataId: id
        }}>
        <Datagrid bulkActionButtons={false}>
          <DateField source='dateTime' label='Date' />
          <TextField source='activityType' label='Status' />
          <TextField source='activityDetail' label='Remarks' />
          <SourceField source='user' reference={constants.R_USERS} />
        </Datagrid>
      </List>
    </FieldSet>
  )
}
