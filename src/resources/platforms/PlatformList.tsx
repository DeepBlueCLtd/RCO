import React from 'react'
import {
  BooleanField,
  BulkDeleteButton,
  CreateButton,
  Datagrid,
  type Identifier,
  List,
  TextField,
  TopToolbar
} from 'react-admin'

interface Props {
  name: string
}

export default function PlatformList(props: Props): React.ReactElement {
  const { name } = props
  const cName: string = name
  const basePath: string = `/reference-data/${cName}`

  const ListActions = (): React.ReactElement => (
    <TopToolbar>
      <CreateButton to={`${basePath}/create`} />
    </TopToolbar>
  )

  return (
    <List actions={<ListActions />} perPage={25}>
      <Datagrid
        rowClick={(id: Identifier) => {
          const cID: string = id.toString()
          return `${basePath}/${cID}`
        }}
        bulkActionButtons={<BulkDeleteButton mutationMode='pessimistic' />}>
        <TextField source='name' />
        <BooleanField source='active' label='Active Platform' />
      </Datagrid>
    </List>
  )
}
