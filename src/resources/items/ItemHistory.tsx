import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  TextField
} from 'react-admin'
import { useParams } from 'react-router-dom'
import SourceField from '../../components/SourceField'
import * as constants from '../../constants'
import FieldSet from '../../components/FieldSet'
import { AuditType } from '../../utils/activity-types'

export default function ItemHistory(): React.ReactElement {
  const { id } = useParams()
  return (
    <FieldSet title='History'>
      <List
        resource={constants.R_AUDIT}
        filter={{
          resource: constants.R_ITEMS,
          dataId: id,
          activityType_neq: AuditType.EDIT
        }}
        sort={{
          field: 'dateTime',
          order: 'DESC'
        }}>
        <Datagrid bulkActionButtons={false}>
          <DateField source='dateTime' label='Date' />
          <TextField<Audit> source='activityType' label='Status' />
          <TextField<Audit> source='activityDetail' label='Remarks' />
          <FunctionField<Audit>
            label='Subject'
            render={(record) => {
              return (
                <SourceField<Audit>
                  source='subjectId'
                  {...(record.subjectResource === constants.R_ITEMS
                    ? { sourceField: 'itemNumber' }
                    : null)}
                  reference={record.subjectResource ?? null}
                  link='show'
                />
              )
            }}
          />
          <SourceField<Audit> source='user' reference={constants.R_USERS} />
        </Datagrid>
      </List>
    </FieldSet>
  )
}
