import React from 'react'
import {
  List,
  TextField,
  DatagridConfigurable,
  TopToolbar,
  SelectColumnsButton,
  CreateButton
} from 'react-admin'
import SourceField from '../../components/SourceField'

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <SelectColumnsButton />
  </TopToolbar>
)

const omitColumns: string[] = [
  'protective_marking_authority',
  'maximum_protective_marking',
  'remarks',
  'id'
]

export default function BatchList(): React.ReactElement {
  return (
    <List perPage={25} actions={<ListActions />}>
      <DatagridConfigurable omit={omitColumns} rowClick='show'>
        <TextField source='id' />
        <TextField label='Reference' source='batch_number' />
        <SourceField source='department' label='Department' />
        <SourceField source='project' reference='projects' label='Project' />
        <SourceField source='platform' reference='platforms' label='Platform' />
        <SourceField source='organisation' label='Organisation' />
        <SourceField
          source='protective_marking_authority'
          reference='protectiveMarkingAuthority'
          label='Protective marking authorityg'
        />
        <SourceField
          source='maximum_protective_marking'
          reference='protectiveMarking'
          label='Maximum protective marking'
        />
        <TextField source='remarks' />
      </DatagridConfigurable>
    </List>
  )
}
