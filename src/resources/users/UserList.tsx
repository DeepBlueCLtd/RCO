import React from 'react'
import {
  BooleanField,
  BulkDeleteButton,
  CreateButton,
  Datagrid,
  DeleteButton,
  EditButton,
  type Identifier,
  List,
  TextField,
  TopToolbar,
  useRecordContext
} from 'react-admin'

interface Props {
  name: string
}

export default function UserList(props: Props): React.ReactElement {
  const { name } = props
  const cName: string = name
  const basePath: string = `/reference-data/${cName}`

  const ListActions = () => {
    return (
      <TopToolbar>
        <CreateButton to={`${basePath}/create`} />
      </TopToolbar>
    )
  }

  const CustomEditButton = () => {
    const record = useRecordContext(props)
    const id = record.id.toString()
    return <EditButton to={`${basePath}/${id}`} />
  }

  return (
    <List actions={<ListActions />} perPage={25}>
      <Datagrid
        rowClick={(id: Identifier) => {
          const cID: string = id.toString()
          return `${basePath}/${cID}`
        }}
        bulkActionButtons={<BulkDeleteButton mutationMode='pessimistic' />}>
        <TextField source='name' />
        <BooleanField source='adminRights' label='Admin Rights' />
        <CustomEditButton />
        <DeleteButton mutationMode='pessimistic' />
      </Datagrid>
    </List>
  )
}
