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

interface ReferenceFieldProps {
  source: string
  label: string
  reference?: string
}

const StockReferenceField = (
  props: ReferenceFieldProps
): React.ReactElement => {
  const { source, label, reference } = props
  return (
    <ReferenceField
      source={source}
      reference={reference !== undefined ? reference : source}
      label={label}>
      <TextField source='name' />
    </ReferenceField>
  )
}

export default function BatchList(): React.ReactElement {
  return (
    <List perPage={25} actions={<ListActions />}>
      <DatagridConfigurable>
        <TextField source='id' />
        <TextField label='Reference' source='batch_number' />
        <TextField source='year_of_receipt' label='Year of receipt' />
        <StockReferenceField source='department' label='Department' />
        <StockReferenceField
          source='project'
          reference='projects'
          label='Project'
        />
        <StockReferenceField
          source='platform'
          reference='platforms'
          label='Platform'
        />
        <StockReferenceField source='organisation' label='Organisation' />
        <StockReferenceField
          source='protective_marking_authority'
          reference='protective-marking-authority'
          label='Protective marking authorityg'
        />
        <StockReferenceField
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
