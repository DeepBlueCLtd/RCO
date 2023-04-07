import React, { useState } from 'react'
import {
  List,
  TextField,
  DatagridConfigurable,
  TopToolbar,
  SelectColumnsButton,
  CreateButton,
  useListContext
} from 'react-admin'
import SourceField from '../../components/SourceField'
import { DateTime } from 'luxon'
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'
import { Box } from '@mui/system'
import { Delete } from '@mui/icons-material'

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
interface OptionType {
  value: string
  label: string
}

const options: OptionType[] = [
  { label: 'Today', value: '1' },
  { label: 'Past Week', value: '2' },
  { label: 'Past Month', value: '3' },
  { label: 'Past Year', value: '4' }
]

export default function BatchList(): React.ReactElement {
  const [date, setDate] = useState<string>('')
  return (
    <>
      <Box display='flex' alignItems='center'>
        <FormControl>
          <InputLabel id='days-label'>Days</InputLabel>
          <Select
            sx={{ minWidth: 120 }}
            style={{ width: '200px' }}
            value={date}
            label='Days'
            labelId='days-label'
            onChange={(e) => { setDate(e.target.value) }}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton onClick={() => { setDate('') }}>
          <Delete />
        </IconButton>
      </Box>
      <List perPage={25} actions={<ListActions />}>
        <ListingComponent date={date} />
      </List>
    </>
  )
}

interface ListingComponentPropType {
  date: string
}

const ListingComponent = ({ date }: ListingComponentPropType) => {
  const { data, isLoading } = useListContext<Batch>()
  if (isLoading) return <div>Loading....</div>

  const modifiedData = getFilteredData(data, date)
  return (
    <DatagridConfigurable
      omit={omitColumns}
      rowClick='show'
      data={modifiedData}>
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
  )
}

const getFilteredData = (data: Batch[], id: string) => {
  switch (id) {
    case '1':
      return data.filter(
        (d) => d.created_at === DateTime.local().toFormat('yyyy-MM-dd')
      )
    case '2': {
      const previousWeekStart = DateTime.now()
        .minus({ weeks: 1 })
        .startOf('week')
      const previousWeekEnd = DateTime.now().minus({ weeks: 1 }).endOf('week')

      return data.filter(
        (d) =>
          DateTime.fromISO(d.created_at) <= previousWeekEnd &&
          DateTime.fromISO(d.created_at) >= previousWeekStart
      )
    }
    case '3': {
      const previousMonthStart = DateTime.now()
        .minus({ month: 1 })
        .startOf('month')
      const previousMonthEnd = DateTime.now().minus({ month: 1 }).endOf('month')

      return data.filter(
        (d) =>
          DateTime.fromISO(d.created_at) <= previousMonthEnd &&
          DateTime.fromISO(d.created_at) >= previousMonthStart
      )
    }
    case '4': {
      const previousYearStart = DateTime.now()
        .minus({ years: 1 })
        .startOf('year')
      const previousYearEnd = DateTime.now().minus({ years: 1 }).endOf('year')

      return data.filter(
        (d) =>
          DateTime.fromISO(d.created_at) <= previousYearEnd &&
          DateTime.fromISO(d.created_at) >= previousYearStart
      )
    }
    default:
      return data
  }
}
