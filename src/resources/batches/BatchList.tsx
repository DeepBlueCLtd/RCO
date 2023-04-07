import React, { useState } from 'react'
import {
  List,
  TextField,
  DatagridConfigurable,
  TopToolbar,
  SelectColumnsButton,
  CreateButton,
  TextInput,
  SelectInput
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
interface ChoiceType {
  id: string
  name: string
}
const choices: ChoiceType[] = [
  { id: 'today', name: 'Today' },
  {
    id: 'past_week',
    name: 'Past week'
  },
  { id: 'past_month', name: 'Past month' },
  { id: 'past_year', name: 'Past year' }
]

export default function BatchList(): React.ReactElement {
  const [date, setDate] = useState<number>()

  const postFilters = [
    <TextInput label='Search' source='q' alwaysOn key={'search-filter'} />,
    <SelectInput
      source='created_at'
      choices={choices}
      onChange={(d) => { setDate(d.target.value) }}
      key={'created_at-filter'}
    />
  ]

  console.log({ date })
  return (
    <List perPage={25} actions={<ListActions />} filters={postFilters}>
      <DatagridConfigurable omit={omitColumns} rowClick='show'>
        <TextField source='id' />
        <TextField label='Reference' source='batch_number' />
        <SourceField source='department' label='Department' />
        <SourceField source='project' reference='projects' label='Project' />
        <SourceField source='platform' reference='platforms' label='Platform' />
        <SourceField source='organisation' label='Organisation' />
        <SourceField
          source='protective_marking_authority'
          reference='protective-marking-authority'
          label='Protective marking authorityg'
        />
        <SourceField
          source='maximum_protective_marking'
          reference='protective-marking'
          label='Maximum protective marking'
        />
        <TextField source='remarks' />
        <TextField source='created_at' label='Creation Date' />
      </DatagridConfigurable>
    </List>
  )
}
