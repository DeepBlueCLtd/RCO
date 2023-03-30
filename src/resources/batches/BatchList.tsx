import React from 'react'
import {
  List,
  TextField,
  ReferenceField,
  EditButton,
  DeleteButton,
  DatagridConfigurable,
  TopToolbar,
  SelectColumnsButton,
  CreateButton
} from 'react-admin'

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <SelectColumnsButton />
  </TopToolbar>
)

export default function BatchList(): React.ReactElement {
  return (
    <List perPage={25} actions={<ListActions />}>
      <DatagridConfigurable>
        <TextField source='id' />
        <TextField source='name' />
        <TextField source='year_of_receipt' label='Year of receipt' />
        <ReferenceField source='vault' reference='vault' label='Vault' />
        <ReferenceField
          source='department'
          reference='department'
          label='Department'
        />
        <ReferenceField source='project' reference='projects' label='Project' />
        <ReferenceField
          source='platform'
          reference='platforms'
          label='Platform'
        />
        <ReferenceField
          source='organisation'
          reference='organisation'
          label='Organisation'
        />
        <ReferenceField
          source='protective_marking_authority'
          reference='protective-marking-authority'
          label='Protective marking authorityg'
        />
        <ReferenceField
          source='maximum_protective_marking'
          reference='protective-marking'
          label='Maximum protective marking'
        />
        <TextField source='remarks' />
        <EditButton />
        <DeleteButton />
      </DatagridConfigurable>
    </List>
  )
}
