import React from 'react'
import {
  Datagrid,
  List,
  TextField,
  ReferenceField,
  DateField
} from 'react-admin'
import * as constants from '../../constants'

export default function AuditList(): React.ReactElement {
  return (
    <List
      perPage={25}
      sort={{
        field: 'dateTime',
        order: 'DESC'
      }}>
      <Datagrid bulkActionButtons={false}>
        <ReferenceField source='user_id' reference={constants.R_USERS} />
        <DateField source='dateTime' label='Date Time' showTime />;
        <TextField source='activityType' label='Activity Type' />
        <TextField source='activityDetail' label='Activity Details' />
        <TextField source='securityRelated' label='Security Related' />
      </Datagrid>
    </List>
  )
}
