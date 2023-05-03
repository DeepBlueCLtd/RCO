import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { type ReactElement, useEffect, useState } from 'react'
import { useListContext } from 'react-admin'
import { DateTime } from 'luxon'

type Values = 'today' | 'past_week' | 'past_month' | 'past_year' | ''

const items: Array<{ value: Values; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'past_week', label: 'Past week' },
  { value: 'past_month', label: 'Past month' },
  { value: 'past_year', label: 'Past year' }
]

interface Props {
  label?: string
  source: string
  format?: string
}

interface Filter {
  key: string
  value?: string
}

const getFilter = (value: Values, source: string, format: string): Filter[] => {
  const minusFromNow = (unit: 'week' | 'month' | 'year'): string => {
    const now = DateTime.now()
    return now.minus({ [unit]: 1 }).toFormat(format)
  }

  const now = DateTime.now().toFormat(format)
  const gteKeyName: string = `${source}_gte`
  const lteKeyName: string = `${source}_lte`

  const todayFilter: Filter = { key: lteKeyName, value: now }

  const resetTodayFilter: Filter = { key: source, value: undefined }
  const resetGTFilter: Filter = { key: gteKeyName, value: undefined }
  const resetLTFilter: Filter = { key: lteKeyName, value: undefined }

  switch (value) {
    case 'today':
      return [{ key: source, value: now }, resetLTFilter, resetGTFilter]
    case 'past_week':
      return [
        resetTodayFilter,
        todayFilter,
        {
          key: gteKeyName,
          value: minusFromNow('week')
        }
      ]
    case 'past_month':
      return [
        resetTodayFilter,
        todayFilter,
        {
          key: gteKeyName,
          value: minusFromNow('month')
        }
      ]
    case 'past_year':
      return [
        resetTodayFilter,
        todayFilter,
        {
          key: gteKeyName,
          value: minusFromNow('year')
        }
      ]
    default:
      return [resetTodayFilter, resetLTFilter, resetGTFilter]
  }
}

const useResetFilter = (source: string): void => {
  const { setFilters, displayedFilters } = useListContext()
  useEffect(() => {
    if (displayedFilters?.[source] === false) {
      setFilters(getFilter('', source, ''), displayedFilters)
    }
  }, [displayedFilters])
}

export function ResetDateFilter(props: Props): ReactElement {
  useResetFilter(props.source)
  return <></>
}

export default function DateFilter(props: Props): ReactElement {
  const { label, source, format = 'yyyy-LL-dd' } = props
  const [value, setValue] = useState<Values>('')

  const { setFilters, filterValues, displayedFilters } = useListContext()

  const onChange = (event: any): void => {
    const value = event.target.value as Values
    if (typeof value !== 'undefined') {
      const filters = getFilter(value, source, format)
      filters.forEach((filter) => {
        const { key, value } = filter
        filterValues[key] = value
      })
      setFilters(filterValues, displayedFilters)
    }
    setValue(value)
  }

  return (
    <FormControl sx={{ width: '164px' }}>
      <InputLabel id={source}>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        name={source}
        labelId={source}
        label={label}>
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
