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
  'protectiveMarkingAuthority',
  'maximumProtectiveMarking',
  'remarks',
  'id'
]

export default function BatchList(): React.ReactElement {
  return (
    <List perPage={25} actions={<ListActions />}>
      <DatagridConfigurable omit={omitColumns} rowClick='show'>
        <TextField source='id' />
        <TextField label='Reference' source='batchNumber' />
        <SourceField source='department' label='Department' />
        <SourceField
          source='project'
          reference={constants.R_PROJECTS}
          label='Project'
        />
        <SourceField
          source='platform'
          reference={constants.R_PLATFORMS}
          label='Platform'
        />
        <SourceField source='organisation' label='Organisation' />
        <SourceField
          source='protectiveMarkingAuthority'
          reference='protectiveMarkingAuthority'
          label='Protective marking authorityg'
        />
        <SourceField
          source='maximumProtectiveMarking'
          reference='protectiveMarking'
          label='Maximum protective marking'
        />
        <TextField source='remarks' />
      </DatagridConfigurable>
    </List>
  )
}
